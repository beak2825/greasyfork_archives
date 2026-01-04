// ==UserScript==
// @name         Blurb stuff
// @namespace    http://tampermonkey.net/
// @version      0.2.5.5
// @description  try to take over the world!
// @author       You
// @match        http://matchlandserver.milamit.cz/matchland*/admin/matchlandios/messagetoplayer/*
// @match        http://bakeacakeserver.milamit.cz/bakeacake*/admin/bakeacakeios/messagetoplayer/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// jshint multistr: true
// @downloadURL https://update.greasyfork.org/scripts/370070/Blurb%20stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/370070/Blurb%20stuff.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function($){

        GM_xmlhttpRequest ({
            method:     "GET",
            url:        "https://codepen.io/alanwork100/pen/KGbWGb.css", //blurb
            onload:     function (response){
                GM_addStyle (response.responseText);
                console.log(response);
            }
        });
        GM_xmlhttpRequest ({
            method:     "GET",
            url:        "https://codepen.io/alanwork100/pen/aRPWOZ.css", //krak
            onload:     function (response){
                GM_addStyle (response.responseText);
                console.log(response);
            }
        });
        GM_xmlhttpRequest ({
            method:     "GET",
            url:        "https://codepen.io/alanwork100/pen/LgMyZy.css", //otherSupportButtons
            onload:     function (response){
                GM_addStyle (response.responseText);
                console.log(response);
            }
        });
        GM_xmlhttpRequest ({
            method:     "GET",
            url:        "https://codepen.io/alanwork100/pen/aRPWBB.css", //RubyButtons
            onload:     function (response){
                GM_addStyle (response.responseText);
                console.log(response);
            }
        });


        //=========================================================================================================//
        //Blurbs texts
        var giffDetailsName = "Provide details [bake]";
        var giffDetails = "\
Hello.\n\
\n\
Does it freezing inside match-3 board or in the cafe? Is it more like stuttering or it freezes permanently? \
How often does it happen? Is there specific moment or an action / steps you need to perform to make it freeze?\n\
\n\
I will provide some additional rubies for the detailed reply.\n\
\n\
Best regards,\n\
Ivan / User Support Team";
        //---------------------------------------------------------------------------------------------------------//
        var androidLangName = "Android language";
        var androidLang = "\
Hello.\n\
\n\
In Android OS the language of the game is determined by the language of your phone.\n\
\n\
Have a nice day,\n\
Ivan / User Support Team";
        //---------------------------------------------------------------------------------------------------------//
        var disableNotifAndroid_7dot0Name = "Disable notification [Android 7.0]";
        var disableNotifAndroid_7dot0 = "\
Hello.\n \
\n\
If you just swipe slightly from right to left, then you’ll reveal a gear icon on the right. Tap the gear icon and you’ll find the option to silence or block notifications from that app or game.\
You can also tap More settings at the bottom to jump to the app’s notification page and make further changes.\n\
\n\
Best regards,\n\
Ivan / User Support Team";
        //---------------------------------------------------------------------------------------------------------//
        var disconnectFromFBName = "How to disconnect from Facebook";
        var disconnectFromFB = "\
Good day.\n\
\n\
If you want to disconnect from Facebook follow the instruction below:\n\
1. Go to the facebook.com (works only on desktop version)\n\
2. Log in using your account\n\
3. Click on down arrow icon on the top of the screen and find 'Settings'\n\
4. In the left-side menu find 'Apps and Websites'\n\
5. In 'Active Apps and Websites' section click checkbox 'Bake a cake puzzles & recipes' and hit 'Remove' button.\n\
\n\
Note that we don't recommend to disconnect from Facebook, because it is linked to our save-sync system. Other words - doing so might cause some issues with your game progress. Act at your own risk.\n\
\n\
Best regards,\n\
Ivan / User Support Team";
        //---------------------------------------------------------------------------------------------------------//
        var exitSwipeName = "How to exit the game using gesture";
        var exitSwipe = "\
Hello.\n\
\n\
Use the swipe from the top edge of the screen gesture. It'll make controls appear.\n\
\n\
Best regards,\n\
Ivan / User Support Team";
        //---------------------------------------------------------------------------------------------------------//
        var noSoundName = "Fix sound";
        var noSound = "\
Hello.\n\
\n\
Please check your volume level and sounds option the game settings menu. If everything there seems to be in order - fully restart the game.\n\
\n\
Best regards,\n\
Ivan / User Support Team";
        //---------------------------------------------------------------------------------------------------------//
        var piggyBankName = "How piggy bank works";
        var piggyBank = "\
Hello.\n\
\n\
The piggy bank works as follows: for winning match-3 you granted rubies that are locked inside the piggy bank. When you collected enough rubies (30-50) you can open it for $2.99.\n\
\n\
Best regards,\n\
Ivan / User Support Team";
        //---------------------------------------------------------------------------------------------------------//
        var piggyPayName = "Why should I pay for piggy bank?";
        var piggyPay = "\
Well, let me clarify this situation - piggy bank is a totally optional in a sense that you aren't forced to pay anything. The rubies that are locked in the piggy bank are basically \
created for the players from the thin air and all that piggy does is providing an opportunity to buy rubies for the cheaper price than in the shop. That's pretty much it :)\n\
\n\
Best regards,\n\
Ivan / User Support Team";
        //---------------------------------------------------------------------------------------------------------//
        var FBLivesName = "Lives and Facebook friends";
        var FBLives = "\
Hello.\n\
\n\
You can not - this feature is disabled at the moment. Facebook shut down many social features on apps, including this one. So we had to follow them.\n\
You can receive lives by watching an ad video instead. When you out of lives just tap 'Lives' icon and then 'watch video' button in the poped window.\n\
\n\
Best regards,\n\
Ivan / User Support Team";
        //---------------------------------------------------------------------------------------------------------//
        var feedbackThxName = "Thank you for the feedback!";
        var feedbackThx = "\
Hello.\n\
\n\
Thank you for the feedback. We will keep it in mind while developing future updates. Please find 25 rubies for your participation.\n\
\n\
Best regards,\n\
Ivan / User Support Team";
        //---------------------------------------------------------------------------------------------------------//
        var transactionFailedName = "I payed for stuff and didn't get it";
        var transactionFailed = "\
Hello.\n\
\n\
Sorry about that. We will investigate the your case. Please, find everything you purchased plus some extra for inconvenience.\n\
\n\
Have a nice day,\n\
Development Team.";
        //---------------------------------------------------------------------------------------------------------//
        var restoredSaveName = "We restored your save";
        var restoredSave = "\
Hello.\n\
\n\
We restored your furthest possible save. Please note, that due to technical reason your further progress from this save won't be \
maintained until 2018.02.15 10:10 AM (UTC). After that time everything should operate as usual.\n\
\n\
Best regards,\n\
Ivan / User Support Team";
        //---------------------------------------------------------------------------------------------------------//
        var weInvestName = "We will investigate this issue";
        var weInvest = "\
Hello.\n\
\n\
We will investigate this issue. Please find 25 rubies for reporting.\n\
\n\
Best regards,\n\
Ivan / User Support Team";
        //---------------------------------------------------------------------------------------------------------//
        var cantConnectFBName = "I can't connect to Facebook";
        var cantConnectFB = "\
Hello.\n\
\n\
Usually users can't connect to FB either because of unstable wi-fi / internet connection or because server was unavailable at \
the moment. Trying later with good wi-fi might help.\n\
\n\
Best regards,\n\
Ivan / User Support Team";
        //---------------------------------------------------------------------------------------------------------//
        var updateGameName = "Update your game";
        var updateGame = "\
Hello.\n\
\n\
You have an old version of the game. We suggest you updating to the newest version of the game for the best experience.\n\
\n\
Best regards,\n\
Development Team.";
        //---------------------------------------------------------------------------------------------------------//
        var SBIP_Name = "SBIP [Standard Bug Identification Procedure]";
        var SBIP = "\
Hello.\n\
\n\
Please answer the following questions:\n\
\n\
1. Describe the problem in details.\n\
2. Where does the problem occurred?\n\
3. Does the problem occurred once or multiple times?\n\
4. What are the steps to reproduce it? (if applicable)\n\
\n\
Best regards,\n\
Ivan / User Support Team";
        //---------------------------------------------------------------------------------------------------------//
        var piggyBankExtendedName = "Piggy bank extended explanation";
        var piggyBankExtended = "\
It is important to understand that the piggy bank is just a 'sale offer' for rubies. An extra thing. \
You don't really win those rubies by filling the bank, but rather win the opportunity to purchase that amount of rubies at a reduced price compared to the store.\n\
\n\
You can't get rubies for free - with piggy bank or without it. So there's a piggy bank for the players who wish to pay and get some rubies with discount. \
For those who would like to keep playing without spending money - they are free to do so and can just ignore the whole piggy bank sale thing.\n\
\n\
Best regards,\n\
Ivan / User Support Team";
        //---------------------------------------------------------------------------------------------------------//
        //////////////////////////////RUSSIAN//////////////////////////////
        //---------------------------------------------------------------------------------------------------------//
        var restoredSaveRuName = "Мы восстановили ваш прогресс";
        var restoredSaveRu = "\
Здравствуйте.\n\
\n\
Мы восстановили крайнее возможное сохранение. Примите во внимание, что любой прогресс в игре НЕ БУДЕТ сохраняться до \
2018.02.19 12:30 МСК. После этого времени всё должно работать нормально.\n\
\n\
С наилучшими пожеланиями,\n\
Иван и Команда Разработки.";
        //---------------------------------------------------------------------------------------------------------//
        var weWillFixRuName = "Мы учтём этот баг";
        var weWillFixRu = "\
Здравствуйте.\n\
\n\
Сожалеем об этом, мы постараемся исправить этот недочет в будущих обновлениях. Примите 25 рубинов за доставленные неудобства.\n\
\n\
С наилучшими пожеланиями,\n\
Иван и Команда Разработки.";
        //---------------------------------------------------------------------------------------------------------//
        var piggyBankRuName = "Как работает копилка";
        var piggyBankRu = "\
Здравствуйте.\n\
\n\
Копилка работает следующим образом: за победу в матч-3 вы получаете рубины, которые заперты в копилке. Когда вы собрали достаточно \
рубинов (30-50), вы можете открыть копилку за 229 рублей.\n\
\n\
С наилучшими пожеланиями,\n\
Иван и команда разработчиков.";
        //---------------------------------------------------------------------------------------------------------//
        var cantConnectFBRuName = "Не могу подключиться к Facebook";
        var cantConnectFBRu = "\
Здравствуйте.\n\
\n\
Чаще всего игроки не могут соединиться с Facebook из-за нестабильного wi-fi/интернет или потому что сервер недоступен в данный момент. \
Убедитесь, что вы используете хороший wi-fi и попробуйте позднее.\n\
\n\
С наилучшими пожеланиями,\n\
Иван и команда разработчиков.";
        //---------------------------------------------------------------------------------------------------------//
        var weWillInvestigateRuName = "Мы проанализируем";
        var weWillInvestigateRu = "\
Здравствуйте.\n\
\n\
Мы проанализируем ситуацию. Примите 25 рубинов за ваше сообщение об ошибке.\n\
\n\
С уважением,\n\
Иван и Команда разработки.";
        //---------------------------------------------------------------------------------------------------------//
        var exitSwipeRuName = "Как выйти из игры?";
        var exitSwipeRu = "\
Здравствуйте.\n\
\n\
Используйте жест свайп от верхнего края экрана. Это вызовет элементы управления и позволит закрыть приложение.\n\
\n\
С уважением,\n\
Иван и Команда разработки.";
        //---------------------------------------------------------------------------------------------------------//

        //=========================================================================================================//
        //Adding buttons
        var coreDiv = document.createElement("div");
        coreDiv.id = "blurbButtsWrapper";
        coreDiv.className = "rubyButtsWrapClass";

        //button1
        var butt1 = document.createElement("div");
        butt1.innerHTML = "Summon Blurb Demon";
        butt1.id = "blurbButt";
        butt1.className = "rubButt";

        coreDiv.appendChild(butt1);
        document.querySelectorAll("textarea#id_body")[0].after(coreDiv);
        //=========================================================================================================//
        function blurb(num, txt, txtName,impFlag){

            //Adding blurbs
            var blurbWindow;
            var backdrop;

            if (document.querySelectorAll("div#blurbWindow")[0] == undefined){
                blurbWindow = document.createElement("div");
                blurbWindow.id = "blurbWindow";
            }
            else {
                blurbWindow = document.querySelectorAll("div#blurbWindow")[0];
            }
            if (document.querySelectorAll("div#blurbBackdrop")[0] == undefined){
                backdrop = document.createElement("div");
                backdrop.className = "backdrop";
                backdrop.id = "blurbBackdrop";
            }
            else {
                backdrop = document.querySelectorAll("div#blurbBackdrop")[0];
            }

            //Adding wrappers
            var imp; //important
            var nonimp; //non-important
            if (document.querySelectorAll("#imp")[0] == undefined) {
                imp = document.createElement("div");
                imp.id = "imp";
            }
            else {
                imp = document.querySelectorAll("#imp")[0];
            }
            if (document.querySelectorAll("#nonimp")[0] == undefined) {
                nonimp = document.createElement("div");
                nonimp.id = "nonimp";
            }
            else {
                nonimp = document.querySelectorAll("#nonimp")[0];
            }

            //Adding filling
            var iconPlus = document.createElement("i");
            iconPlus.id = "iconPlus" + num;
            iconPlus.className = "icono-plus";

            var blurb = document.createElement("details");
            blurb.id = "blurb" + num;
            blurb.className = "spoiler";

            var blurbpre = document.createElement("pre");
            blurbpre.id = "blurb" + num + "pre";
            blurbpre.innerHTML = txt;

            var blurbsum = document.createElement("summary");
            blurbsum.innerHTML = txtName;

            if (impFlag) {
                blurbWindow.appendChild(imp);
                imp.appendChild(blurb);
                imp.appendChild(iconPlus);
                blurb.appendChild(blurbpre);
                blurb.appendChild(blurbsum);
            }
            else {
                blurbWindow.appendChild(nonimp);
                nonimp.appendChild(blurb);
                nonimp.appendChild(iconPlus);
                blurb.appendChild(blurbpre);
                blurb.appendChild(blurbsum);
            }


            document.querySelectorAll("textarea#id_body")[0].after(blurbWindow);
            document.querySelectorAll("div#blurbWindow")[0].after(backdrop);

            $( "#blurbButt" ).click(function() {
                document.querySelectorAll("div#blurbWindow")[0].style.display = "block";
                document.querySelectorAll("div#blurbBackdrop")[0].style.display = "block";
            });
            $( "#blurbBackdrop" ).click(function() {
                document.querySelectorAll("div#blurbWindow")[0].style.display = "none";
                document.querySelectorAll("div#blurbBackdrop")[0].style.display = "none";
            });
            $( "#blurb"+num+"pre" ).click(function() {
                document.querySelectorAll("details#blurb"+num)[0].removeAttribute("open");
            });
            console.log("#iconPlus"+num);
            $( "#iconPlus"+num ).click(function() {
                console.log("clas");
                document.querySelectorAll("div#blurbWindow")[0].style.display = "none";
                document.querySelectorAll("div.backdrop")[0].style.display = "none";

                console.log(txt);
                console.log(document.querySelectorAll("textarea#id_body")[0].value);
                document.querySelectorAll("textarea#id_body")[0].value = txt;
            });
        }
        //=========================================================================================================//

        if (/messagelang=(\w+)/.exec(document.location.href) != null){
            if (/messagelang=(\w+)/.exec(document.location.href)[1] == "ru"){ //last is 17
                blurb(1,restoredSaveRu,restoredSaveRuName,false);
                blurb(2,weWillInvestigateRu,weWillInvestigateRuName,false);
                blurb(3,weWillFixRu,weWillFixRuName,false);
                blurb(4,piggyBankRu,piggyBankRuName,false);
                blurb(5,cantConnectFBRu,cantConnectFBRuName,false);
                blurb(6,exitSwipeRu,exitSwipeRuName,false);

            }
            else {
                blurb(11, restoredSave,restoredSaveName,true);
                blurb(10, transactionFailed,transactionFailedName,true);
                blurb(12, weInvest,weInvestName,true);
                blurb(16, SBIP, SBIP_Name, true);
                blurb(6, piggyBank,piggyBankName,true);
                blurb(7, piggyPay,piggyPayName,true);
                blurb(17, piggyBankExtended, piggyBankExtendedName, true);
                blurb(15, giffDetails,giffDetailsName,true);
                blurb(5, noSound,noSoundName,true);
                blurb(9, feedbackThx,feedbackThxName,true);

                blurb(3,disconnectFromFB,disconnectFromFBName,false);
                blurb(1,androidLang,androidLangName,false);
                blurb(2,disableNotifAndroid_7dot0,disableNotifAndroid_7dot0Name,false);
                blurb(4,exitSwipe,exitSwipeName,false);
                blurb(8,FBLives,FBLivesName,false);
                blurb(13,cantConnectFB,cantConnectFBName,false);
                blurb(14,updateGame,updateGameName,false);
            }
        }

    })(django.jQuery);
})();