// ==UserScript==
// @name         Instagram Followers Liker
// @name:ru      Лайкер для Инстаграма
// @version      2.4
// @description  Script will like foolowers recursively
// @description:ru  Скрипт не работает и более не поддерживается.
// @author       Philins
// @match        https://www.instagram.com/*
// @grant        none
// @namespace http://instaliker.site/
// @downloadURL https://update.greasyfork.org/scripts/38743/Instagram%20Followers%20Liker.user.js
// @updateURL https://update.greasyfork.org/scripts/38743/Instagram%20Followers%20Liker.meta.js
// ==/UserScript==

(function() {
    var nextcounter = 0;
    var classfotodiv = 'eLAPa';
    var lang = document.getElementsByTagName("html")[0].getAttribute("lang");
    var languages = ["en", "ru"];
    if(!languages.includes(lang)) lang = "en";
    var trans = {"interval": {
        "en": "Increase if the internet connection is slow. Reduce to accelerate.",
        "ru": "Увеличьте если страница не успевает загрузиться."},
                 "limover": {
                     "en": "Limit over.\nWelcome back tomorrow.\nTimezone GMT+0",
                     "ru": "Исчерпан суточный лимит.\nНе рекомендуется его превышать во избежание блокировки.\nВыключите скрипт или увеличьте лимит.\nTimezone GMT+0 по Москве это 3 часа ночи."},
                 "liked": {
                     "en": "Liked: ",
                     "ru": "Лайков: "},
                 "time": {
                     "en": "Time: ",
                     "ru": "Время: "},
                 "today": {
                     "en": "Today: ",
                     "ru": "Сегодня: "},
                 "limtip": {
                     "en": "Set here daily limit.",
                     "ru": "Скрипт не налайкает в сутки больше чем указано."},
                 "dailylim": {
                     "en": "Daily limit: ",
                     "ru": "Ограничение в сутки: "},
                 "skipover": {
                     "en": "likes more than ",
                     "ru": "лайков больше"},
                 "skiptip": {
                     "en": "Will be skipped if the likes enough.",
                     "ru": "Фотография будет пропущена, если лайков больше чем указано. Также и с просмотрами у видео."},
                 "badtags": {
                     "en": "Bad tags: ",
                     "ru": "Игнорируются: "},
                 "taglist": {
                     "en": "#watch #bikini",
                     "ru": "#бузова #бикини #турагентство #часы #подарок #дом2 #bikini #вналичии #купить #подзаказ #обувь #шоппинг #доставка #бесплатно #магазин #заказ #раскрутка #клиенты #ца #целевая #продвижение #накрутка #подписчики #живыеподписчики"},
                 "listtip": {
                     "en": "Will be skipped if these hashtags was found.",
                     "ru": "При обнаружении хештега или стоп-слова из этого списка, лайк не поставится. Список разделять пробелами."},
                 "manytag": {
                     "en": "hashtags more than ",
                     "ru": "тегов больше "},
                 "manytagtip": {
                     "en": "Will be skipped if hashtags more than...",
                     "ru": "Не ставим лайки любителям тегов."},
                 "rate": {
                     "en": "following/followers more than ",
                     "ru": "подписок/подписчиков больше "},
                 "ratetip": {
                     "en": "If there are 5 times more following than followers, it's probably a spam account.",
                     "ru": "Если подписок в 5 раз больше чем подписчиков, вероятно это спам-аккаунт."},
                 "rate2": {
                     "en": "followers/following more than ",
                     "ru": "подписчиков/подписок больше "},
                 "rate2tip": {
                     "en": "If there are 5 times more followers than following, it's probably a spam account.",
                     "ru": "Если подписчиков в 5 раз больше чем подписок, вероятно это спам-аккаунт."},
                 "manyfoto": {
                     "en": "Deep of feed ",
                     "ru": "Глубина просмотра "},
                 "manyfototip": {
                     "en": "How many photos to watch? ",
                     "ru": "Сколько последних фоток просматривать? "},
                 "manylikeper": {
                     "en": "Likes per accaunt ",
                     "ru": "Лайков на аккаунт "},
                 "manylikepertip": {
                     "en": "How many likes per accaunt? ",
                     "ru": "Сколько лайков ставить на один аккаунт? "},
                 "fol1": {
                     "en": "Followers",
                     "ru": "Подписчики"},
                 "fol2": {
                     "en": "Following",
                     "ru": "Подписки"},
                 "foltip": {
                     "en": "Who to follow? Followers or Following.",
                     "ru": "За кем следовать, подписчиками или подписками? "},
                 "skipif": {
                     "en": "Skip if",
                     "ru": "Пропускать, если"},
                 "stop": {
                     "en": "STOP! Followers not found. Or you are not logged in.",
                     "ru": "Скрипт остановлен. Подписчики не найдены. \nВы должны войти в Instagram."},
                 "notlogged": {
                     "en": "You are not logged in.",
                     "ru": "Вы должны войти в Instagram."},
                 "clearque": {
                     "en": "Clear queue. ",
                     "ru": "Очистить очередь. "},
                 "activate": {
                     "en": "The code is activated. ",
                     "ru": "Код активирован.. "},
                 "howsave": {
                     "en": "How to save settings?",
                     "ru": "Как сохранить настройки?"},
                 "save": {
                     "en": "Saved.",
                     "ru": "Сохранено."},
                 "intrvl": {
                     "en": "Period, in sec.",
                     "ru": "Период, в сек."},
                };
    var statbox;
    var stattext =localStorage.stattext;
    var area;
    var k_tek;
    var timerId;
    var counter = 0;
    var firststep = true;
    var start_time_milliseconds = new Date().getTime();
    var followers = localStorage.getItem('followers');
    followers = (followers !== null ? JSON.parse(followers) : []);

    if(!inIframe()){
        var settings = localStorage.getItem('settings');
        settings = (settings!==null ? JSON.parse(settings) : {'daylimit': 500, 'likelimit': 100, 'taglimit': 20, 'fotolimit': 10, 'setlike': 8, 'fol': 1, 'sb': false, 'interval': 5, 'rate': 5, 'rate2': 5});
        if(!settings.rate)settings.rate=5;
        if(!settings.rate2)settings.rate2=5;
        var skiplist = (localStorage.skiplist!==undefined ? localStorage.skiplist : trans.taglist[lang]);
        var info = document.createElement("DIV");
        statbox = document.createElement("DIV");
        info.appendChild(statbox);
        info.style.cssText = 'position:fixed;width:160px;z-index:100;background:#DDD;top: 10px;opacity: 0.9;left: 10px;padding:4px;';
        document.body.appendChild(info);
        timerId = setInterval(takt, 1000*settings.interval);
    }


    function takt(){
        var path = window.location.pathname;
        statbox.innerHTML = stattext;
        var info = document.getElementById('settings');

        var current_time_milliseconds = new Date().getTime();
        var thisday = "d" + Math.floor(current_time_milliseconds / 86400000).toString();
        var daystat = new Object();
        if(localStorage.daystat !== undefined){
            daystat = JSON.parse(localStorage.daystat);
        }else{
            daystat[thisday] = 0;
            localStorage.daystat = JSON.stringify(daystat);
        }

        if(window._sharedData && window._sharedData.config.viewer==null){
            stattext = trans.notlogged[lang];
            statbox.innerHTML = stattext;
            localStorage.stattext = stattext;
            return false;
        }

        if(path=='/' && !info){ // Показываю настройки
             firststep = true;
            Settings();
            return false;
        }
        if(path!='/' && info){ // Скрываю настройки
            info.remove();
        }

        var partpath = path.split('/');

        if(partpath[1]=='p'){ // Лайки

            var daylicounter = daystat[thisday];
            var dc = (daylicounter!==undefined ? daylicounter : 0);
            if(dc >= parseInt(settings.daylimit)) {
                clearInterval(timerId);
                alert(trans.limover[lang]);
                return false;
            }

            if(DoubleLikes()){
                Finish();
                return false;
            }

            if(LikeReady()){ // Лайкаю
                dc++;
                daystat[thisday] = dc;
                localStorage.daystat = JSON.stringify(daystat);
                console.log('Daily: ' + dc);
                Like();
                stattext = trans.liked[lang] + counter + '<br>' + trans.today[lang] + dc;
            }else{// Листаю дальше
                stattext = trans.today[lang] + dc;
                localStorage.stattext = stattext;
                if(nextcounter < settings.fotolimit - 1){
                    ListNext();
                }else{
                    Finish();
                }
            }
        }else if(partpath[1]=='explore' && partpath[2]=='tags'){ // Иду по тегам
            var fotot = document.getElementsByClassName(classfotodiv);
            if(fotot.length > 0){
                fotot[9].parentNode.click();
            }else{
                Finish(0,'Foto not found');
            }
        }else if(partpath[1]=='AlskDJfhG'){
            settings.sb = true;
            localStorage.setItem('settings', JSON.stringify(settings));
            stattext = trans.activate[lang];
            statbox.innerHTML = stattext;
            localStorage.stattext = stattext;
            Finish(1);
        }else if(partpath[2]=='followers' || partpath[2]=='following'){ // Собираю пользователей в очередь
            var d = document.getElementsByTagName('DIV');
            for(var g = 0; g < d.length; g++){
                if(d[g].hasAttribute("role") && d[g].getAttribute("role") == 'dialog'){
                    var a = d[g].getElementsByTagName('A');
                    for(var k = 0; k < a.length; k++){
                        if(a[k].hasAttribute("title")){
                            var ah = a[k].getAttribute("href");
                            followers.push(ah);
                        }
                    }
                    d[g].getElementsByTagName('BUTTON')[0].click();
                }
            }
        }else if(partpath[1]!='' && firststep){
            FindFollowersRate();
            var folink = FindFollowersLink();
            if(folink){
                firststep = false;
                folink.click();
            }else{
                Finish();
            }
        }else if(!firststep){
            var foto = document.getElementsByClassName(classfotodiv);
            if(foto.length > 0){
                foto[0].parentNode.click();
            }else{
                Finish(0,'Foto not found');
            }
         }
        statbox.innerHTML = stattext;
    }


    function findHeart(){
        var section = document.getElementsByTagName("section");
        for(var k = 1; k < section.length; k++){
            var span = section[k].getElementsByTagName("span");
            for(var j = 0; j < span.length; j++){
                var c = span[j].classList.value;
                if(c.indexOf("SpriteHeart")>0){
                    k_tek=k+1;
                        return span[j].parentNode;
                }
            }
        }
        return false;
    }


    function findLiked(){
        findHeart();
        var section = document.getElementsByTagName("section");
        var span = section[k_tek].getElementsByTagName("span");
        for(var j = 0; j < span.length; j++){
            if (parseInt(span[j].innerText) > 0) {
                return span[j].innerText.replace(/ /g, "");
            }
        }
        return false;
    }

    function Like(){
        var button = findHeart();
        if(button){
            button.click();
            console.log('Like');
            counter++;
            return true;
        }
    }

    function ListNext(){
        if(counter>settings.setlike) Finish();
        var buttons = document.getElementsByClassName("coreSpriteRightPaginationArrow");
        if (buttons.length > 0) {
            nextcounter++;
            buttons[0].click();
        }else{
            Finish();
        }
    }

    function CheckHeart(){
        var h = findHeart();
        var c = h.firstElementChild.classList.value;
        if(c.search("red")>0){
            return false;
        }
        var x = findLiked();
        if(x >= parseInt(settings.likelimit)){
            console.log('Not liked, too many likes');
            return false;
        }

        return true;
    }

    function DoubleLikes(){
        var x = findLiked();
        if(x >= 2*parseInt(settings.likelimit)){
            console.log('Next user, too many likes');
            return true;
        }
        return false;
    }


    function CheckTags(){
        var re = /\s+/;
        var skiparr = skiplist.split(re);
        var comdiv = document.getElementsByClassName("EtaWk");
        if(comdiv.length > 0){
            var comments = comdiv[0].innerText.toLowerCase();
            //console.log(comments);
            if((comments.match(/#/g) || []).length > settings.taglimit){
                console.log('Not liked, too many tags');
                return false;
            }else{
                for(var i = 0; i < skiparr.length; i++){
                    if(skiparr[i].length > 0){
                        var j = comments.indexOf(skiparr[i]);
                        if(j!==-1){
                            console.log('Not liked, bad tag');
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    function LikeReady(){
        if(CheckHeart() && CheckTags()){
            return true;
        }
        return false;
    }

    function Finish(id=0, text='Finish'){
        // id
        // 1 Превышен суточный лимит.
        console.log(text);
        var follower;
        var newurl;
        var usedfollowers = localStorage.getItem('usedfollowers');
        usedfollowers = (usedfollowers!==null ? JSON.parse(usedfollowers) : []);
        do{
            follower = followers.shift();
        }while(usedfollowers.includes(follower));
        usedfollowers.push(follower);
        localStorage.setItem('usedfollowers', JSON.stringify(usedfollowers));
        localStorage.setItem('followers', JSON.stringify(followers));

        if(follower){
            newurl = window.location.protocol + '//' + window.location.hostname + follower;
            if(id==1) newurl = window.location.protocol + '//' + window.location.hostname;
            window.location = newurl;
        }else{
            alert(trans.stop[lang]);
        }
    }


    function FindFollowersRate(){
        var folink = document.getElementsByClassName('-nal3');
        if(folink.length > 0){
            if(folink[2].getElementsByTagName("span")[0].innerText.replace( /\s/g, "" )/folink[1].getElementsByTagName("span")[0].innerText.replace( /\s/g, "" )>settings.rate){
                Finish(0, "Bad rating.");
            }else{
                console.log("Good rating.");
            }
            if(folink[1].getElementsByTagName("span")[0].innerText.replace( /\s/g, "" )/folink[2].getElementsByTagName("span")[0].innerText.replace( /\s/g, "" )>settings.rate2){
                Finish(0, "Bad rating 2.");
            }else{
                console.log("Good rating 2.");
            }
        }
    }

    function FindFollowersLink(){
        var folink = document.getElementsByClassName('-nal3');
        if(folink.length > 0){
            if(folink[settings.fol].nodeName == 'A'){
                return folink[settings.fol];
            }else{
                return false;
            }
        }else{
            console.log('Followers link not found');
            return false;
        }
    }

    function cell1(textnode){
        var label = document.createElement("LABEL");
        var text = document.createTextNode(textnode);
        label.appendChild(text);
        var d = document.createElement("DIV");
        d.className = 'cell';
        d.appendChild(label);
        return d
    }

    function cell2(data, tip, name){
        var input = document.createElement("INPUT");
        input.setAttribute("type", "text");
        input.id = name;
        input.value = data;
        input.style.cssText = 'width:40px;';
        var d = document.createElement("DIV");
        d.className = 'cell';
        d.setAttribute("data-tip", tip);
        d.appendChild(input);
        return d
    }

    function Settings(){
        var style = document.createElement('style');
        style.innerHTML = "[data-tip] {    position:relative;}[data-tip]:before {    content:'';    /* hides the tooltip when not hovered */    display:none;    content:'';    display:none;    border-left: 5px solid transparent;    border-right: 5px solid transparent;    border-bottom: 5px solid #1a1a1a;    position:absolute;    top:30px;    left:35px;    z-index:8;    font-size:0;    line-height:0;    width:0;    height:0;    position:absolute;    top:30px;    left:35px;    z-index:8;    font-size:0;    line-height:0;    width:0;    height:0;}[data-tip]:after {    display:none;    content:attr(data-tip);    position:absolute;    top:35px;    left:0px;    padding:5px 8px;    background:#1a1a1a;    color:#fff;    z-index:9;    font-size: 0.75em;    height:18px;    line-height:18px;    -webkit-border-radius: 3px;    -moz-border-radius: 3px;    border-radius: 3px;    white-space:nowrap;    word-wrap:normal;}[data-tip]:hover:before,[data-tip]:hover:after {    display:block;} .table {display: table; padding: 10px;} .row {display: table-row;} .cell {display: table-cell;}";
        document.body.appendChild(style);
        var info = document.createElement("DIV");
        info.setAttribute('id', 'settings');
        //statbox = document.createElement("DIV");
        //info.appendChild(statbox);
        var dt = document.createElement("DIV");
        dt.className = 'table';
        var d1 = document.createElement("DIV");
        d1.className = 'row';
        d1.appendChild(cell1(trans.dailylim[lang]));
        d1.appendChild(cell2(settings.daylimit, trans.limtip[lang], 'input1'));
        dt.appendChild(d1);

        var text12 = document.createTextNode(trans.skipif[lang]);
        dt.appendChild(text12);

        var d2 = document.createElement("DIV");
        d2.className = 'row';
        d2.appendChild(cell1("• "+trans.skipover[lang]));
        d2.appendChild(cell2(settings.likelimit, trans.skiptip[lang], 'input2'));
        dt.appendChild(d2);

        var d3 = document.createElement("DIV");
        d3.className = 'row';
        d3.appendChild(cell1("• "+trans.manytag[lang]));
        d3.appendChild(cell2(settings.taglimit, trans.manytagtip[lang], 'input3'));
        //dt.appendChild(d3);

        var d31 = document.createElement("DIV");
        d31.className = 'row';
        d31.appendChild(cell1("• "+trans.rate[lang]));
        d31.appendChild(cell2(settings.rate, trans.ratetip[lang], 'input31'));

        var d32 = document.createElement("DIV");
        d32.className = 'row';
        d32.appendChild(cell1("• "+trans.rate2[lang]));
        d32.appendChild(cell2(settings.rate2, trans.rate2tip[lang], 'input32'));
        //dt.appendChild(d3);

        var d4 = document.createElement("DIV");
        d4.className = 'row';
        d4.appendChild(cell1(trans.manyfoto[lang]));
        d4.appendChild(cell2(settings.fotolimit, trans.manyfototip[lang], 'input4'));
        //dt.appendChild(d4);

        var d5 = document.createElement("DIV");
        d5.className = 'row';
        d5.appendChild(cell1(trans.manylikeper[lang]));
        d5.appendChild(cell2(settings.setlike, trans.manylikepertip[lang], 'input5'));
        //dt.appendChild(d5);

        var d8 = document.createElement("DIV");
        d8.className = 'row';
        d8.appendChild(cell1(trans.intrvl[lang]));
        d8.appendChild(cell2(settings.interval, trans.interval[lang], 'input8'));

        var d6 = document.createElement("DIV");
        d6.className = 'table';
        var input61 = document.createElement("INPUT");
        var text61 = document.createTextNode(trans.fol1[lang]);
        input61.type = 'radio';
        input61.name = 'radio';
        input61.value = 1;
        if(settings.fol == 1) input61.checked = true;
        var input62 = document.createElement("INPUT");
        var text62 = document.createTextNode(trans.fol2[lang]);
        input62.type = 'radio';
        input62.name = 'radio';
        input62.value = 2;
        if(settings.fol == 2) input62.checked = true;
        var d61 = document.createElement("DIV");
        d61.style.display = 'table-cell';
        var d62 = document.createElement("DIV");
        d62.style.display = 'table-cell';
        d61.appendChild(input61);
        d61.appendChild(text61);
        d62.appendChild(input62);
        d62.appendChild(text62);
        d6.setAttribute("data-tip", trans.foltip[lang]);
        d6.appendChild(d61);
        d6.appendChild(d62);

        dt.appendChild(d3);
        dt.appendChild(d31);
        dt.appendChild(d32);
        dt.appendChild(d4);
        dt.appendChild(d5);
        dt.appendChild(d8);
        info.appendChild(dt);
        info.appendChild(d6);
        info.appendChild(document.createTextNode(trans.badtags[lang]));

        var d7 = document.createElement("DIV");
        d7.setAttribute("data-tip", trans.listtip[lang]);
        area = document.createElement("TEXTAREA");
        area.value = skiplist;
        area.style.cssText = 'width: 97%; height: 100%;';
        d7.style.cssText = 'height: 100px;';
        d7.appendChild(area);
        info.appendChild(d7);

        if(settings.sb){
            var input8 = document.createElement("INPUT");
            input8.type = 'button';
            input8.value = 'Save';
            input8.addEventListener('click', function() {
                Save(document.getElementById("input1").value, document.getElementById("input2").value, document.getElementById("input3").value, document.getElementById("input4").value, document.getElementById("input5").value, area.value, input61.checked, settings.sb, document.getElementById("input8").value, document.getElementById("input31").value, document.getElementById("input32").value);
            }, false);

            info.appendChild(input8);
        }else{
            var a8 = document.createElement("A");
            a8. setAttribute('href', 'http://instaliker.site/');
            a8. setAttribute('target', '_blank');
            a8.innerHTML = trans.howsave[lang];
            info.appendChild(a8);
        }

        if(followers){
            var input10 = document.createElement("INPUT");
            input10.type = 'button';
            input10.value = trans.clearque[lang] + followers.length;
            input10.addEventListener('click', function() {
                Clear(input10);
            }, false);

            info.appendChild(input10);
        }
        info.style.cssText = 'position:fixed;width:360px;z-index:100;background:#DDD;top: 77px;opacity: 0.9;left: 10px;padding:4px;';
        document.body.appendChild(info);
    }

    function Save(dl, ll, tl, fl, sl, skiplist, radio, sb, interval, rate, rate2){
        var rb = (radio) ? 1 : 2;
        settings = {'daylimit' : dl, 'likelimit' : ll, 'taglimit' : tl, 'fotolimit' : fl, 'setlike': sl, 'fol': rb, 'sb': sb, 'interval': interval, 'rate': rate, 'rate2': rate2};
        localStorage.setItem('settings', JSON.stringify(settings));
        localStorage.setItem('skiplist', skiplist);
        stattext = trans.save[lang];
        statbox.innerHTML = stattext;
        localStorage.stattext = stattext;
         var username = window._sharedData.config.viewer.username
    }

    function Clear(e){
        localStorage.removeItem("followers");
        e.style.display='none';
    }

    function millisecondsToStr (milliseconds) {
        // TIP: to find current time in milliseconds, use:
        // var  current_time_milliseconds = new Date().getTime();

        function numberEnding (number) {
            return (number > 1) ? 's' : '';
        }

        var temp = Math.floor(milliseconds / 1000);
        var years = Math.floor(temp / 31536000);
        if (years) {
            return years + ' year' + numberEnding(years);
        }
        //TODO: Months! Maybe weeks?
        var days = Math.floor((temp %= 31536000) / 86400);
        if (days) {
            return days + ' day' + numberEnding(days);
        }
        var hours = Math.floor((temp %= 86400) / 3600);
        if (hours) {
            return hours + ' hour' + numberEnding(hours);
        }
        var minutes = Math.floor((temp %= 3600) / 60);
        if (minutes) {
            return minutes + ' minute' + numberEnding(minutes);
        }
        var seconds = temp % 60;
        if (seconds) {
            return seconds + ' second' + numberEnding(seconds);
        }
        return 'less than a second';
    }

    function inIframe () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }


})();