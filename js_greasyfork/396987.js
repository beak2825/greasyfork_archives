// ==UserScript==
// @name         ClanHelper
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  try to take over the world!
// @author       You
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/clan_info.+/
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/396987/ClanHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/396987/ClanHelper.meta.js
// ==/UserScript==

(function (window, undefined) {
    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }

        setPolzynok();
        setStyle();

    function setPolzynok() {
        document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend", '<meta name="viewport" content="width=device-width, user-scalable=no">');
        document.getElementById("android_main").style.height = "100%";
        document.getElementById("android_main").style.width = "100%";
        document.getElementById("android_container").innerHTML='';
        let myDiv = `
            <div id="main-container">
    <style>
        input[id^="spoiler"] {
            display: none;
        }

        input[id^="spoiler"] + label {
            display: block;
            text-align: center;
            font-size: 14px;
            cursor: pointer;
            transition: all .6s;
        }

        input[id^="spoiler"] ~ .spoiler {
            width: 97%;
            float: left;
            height: 0;
            overflow: hidden;
            opacity: 0;
            padding: 10px;
            background: #eee;
            border: 1px solid #ccc;
            transition: all .6s;
        }

        input[id^="spoiler"]:checked + label + .spoiler {
            height: auto;
            opacity: 1;
            padding: 10px;
        }

        .inner {
            margin: 0;
            padding: 0;
            display: inline-block;
            vertical-align: middle;
        }

        .my-table td {
            min-width: 10%;
            text-align: center;
        }
        table.ololo td {
            text-align: center;
        }
        table.ololo {
            border-collapse: collapse;
        }
        table.ololo td {
            border: 0;
        }
        table.ololo tr:first-child td {
            border-top: 0;
        }
        table.ololo tr td:first-child {
            border-left: 0;
        }
        table.ololo tr:last-child td {
            border-bottom: 0;
        }
        table.ololo tr td:last-child {
            border-right: 0;
        }

        table.ololo td, table.ololo td a{
            font-size: 24px;
        }
        table.ololo td button {
            margin-top: 20px;
            padding: 10px;
        }
        #ololo2 td {
            width: 50%;
        }
        a.ololo1 {
         float: right;
        }

        .ololo3 td {
            text-align: center;
        }
    </style>

    <table class="wb" width="100%" cellpadding="3" align="left">
        <tbody>
        <tr>
            <td class="wblight" width="100%">
                <table class="my-table" width="100%">
                    <tr>
                        <td colspan="4">
                            <br>
                            <div class="inner"><img width="24" src="https://img.icons8.com/ios/500/minecraft-sword.png">
                            </div>
                            <div class="inner"><img width="40" border="0"
                                                    src="https://dcdn.heroeswm.ru/i_clans/l_1519.gif?v=95"></div>
                            <div class="inner"><b>#1519 Украина</b></div>
                            <br>
                        </td>
                        <td colspan="2">
                            <br>
                            <div class="inner">
                                <img width="48"
                                     src="https://cdn0.iconfinder.com/data/icons/pregnancy-healthy/32/Avatar_emoticon_emotion_face_sleep-512.png">
                            </div>
                            <div class="inner"><p style=" font-size: 14px">C&nbsp;&nbsp;23:00 <br>по 13:00</p></div>
                            <br>
                        </td>
                    </tr>
                    <tr>
                        <td width="70">
                            <img align="absmiddle" src="https://dcdn.heroeswm.ru/i/icons/attr_initiative.png?v=1"
                                 border="0"
                                 width="32">
                            <img align="absmiddle"
                                 src="https://dcdn.heroeswm.ru/i/icons/attr_defense.png?v=1"
                                 border="0" width="32"><img
                                align="absmiddle" src="https://dcdn.heroeswm.ru/i/icons/attr_attack.png?v=1" border="0"
                                width="32">
                        </td>
                        <td>
                            <div class="inner"><img width="30"
                                                    src="https://i.pinimg.com/originals/1d/3d/fa/1d3dfa2fc0274ab10fcf423d2ee3c025.png">
                            </div>
                            <div class="inner">
                                <a href="clan_info.php?id=823"><img
                                        src="https://dcdn.heroeswm.ru/i_clans/l_823.gif?v=112" width="40"
                                        title="#823 Ginger Tail" border="0" alt="#823" align="absmiddle"></a><img
                                    src="https://dcdn.heroeswm.ru/i/transparent.gif" width="2" height="15" alt=""
                                    align="absmiddle">
                            </div>
                        </td>

                        <td>
                            <div class="inner"><img width="40"
                                                    src="https://image.flaticon.com/icons/png/512/33/33308.png"></div>
                            <div class="inner"><b>200</b></div>

                        </td>
                        <td>
                            <div class="inner"><img width="40"
                                                    src="https://pointsshop.com.au/wp-content/uploads/2017/12/icon-rewardsloyaltyframework.png">
                            </div>
                            <div class="inner"><b>26,041</b></div>
                        </td>
                        <td>
                            <div class="inner"><img width="48" src="https://dcdn3.heroeswm.ru/i/gold.gif" border="0"
                                                    title="Золото"
                                                    alt=""></div>
                            <div class="inner">40,729</div>
                        </td>
                        <td>
                            <div class="inner"><a href="blank"><img width="48"
                                                                    src="https://cdn.onlinewebfonts.com/svg/img_527746.png"></a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="wbwhite">

                <table class="ololo" align="center">
                    <tr>
                        <td colspan="2">
                            <a class="pi" href="pl_info.php?id=2690161">xvxPAINxvx</a> - Глава
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <a class="pi" href="pl_info.php?id=2190182">Anasteyshan</a> - Заместитель
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button
                                    class="pi"
                                    href="clan_log.php?id=1519">Протокол</button>
                        </td>
                        <td>
                            <button
                                    class="pi" href="sklad_info.php?id=38">Склад</button>
                        </td>
                    </tr>
                </table>

        </tr>

        <tr>
            <td colspan="2" class="wbwhite">
                <center><input type="checkbox" id="spoiler6"/>
                    <label for="spoiler6"><b>Должностные лица</b></label>
                    <div class="spoiler">
                        <table id="ololo2" class="wb" width="100%" cellpadding="5" cellspacing="0" align="center">
                            <tbody>
                            <tr>
                                <td><a class="pi ololo1" href="pl_info.php?id=2164199">_СЕРЫЙ_ВОЛЧАРА_</a></td>
                                <td>Воевода, Глашатай</td>
                            </tr>
                            <tr>
                                <td><a class="pi ololo1" href="pl_info.php?id=2897299">Flaterry</a></td>
                                <td>Казначей</td>
                            </tr>
                            <tr>
                                <td><a class="pi ololo1" href="pl_info.php?id=2967706">A-MeTeOr-</a></td>
                                <td>Кладовщик, Вербовщик, Глашатай</td>
                            </tr>
                            <tr>
                                <td><a class="pi ololo1" href="pl_info.php?id=1371273">Sarnydeath</a></td>
                                <td>Вербовщик, Глашатай</td>
                            </tr>
                            <tr>
                                <td><a class="pi ololo1" href="pl_info.php?id=2100246">--LION4IK--</a></td>
                                <td>Вербовщик</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </center>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="wbwhite">
                <center><input type="checkbox" id="spoiler5"/>
                    <label for="spoiler5"><b>Строения</b></label>
                    <div class="spoiler">
                        <table class="wb ololo3" width="100%" cellpadding="5" cellspacing="0" align="center">
                            <tbody>
                            <tr>
                                <td><a href="clan_build_log.php?cl_id=1519&amp;b_id=270">Командный пункт</a></td>
                            </tr>
                            <tr>
                                <td><a href="clan_build_log.php?cl_id=1519&amp;b_id=337">Тайное логово</a></td>
                            </tr>
                            <tr>
                                <td><a
                                        href="clan_build_log.php?cl_id=1519&amp;b_id=377">Башня шпионов</a></td>
                            </tr>
                            <tr>
                                <td><a
                                        href="clan_build_log.php?cl_id=1519&amp;b_id=449">Шатер альянса</a></td>
                            </tr>
                            <tr>
                                <td><a
                                        href="clan_build_log.php?cl_id=1519&amp;b_id=123">Тренировочный лагерь</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </center>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="wbwhite">
                <center><input type="checkbox" id="spoiler"/>
                    <label for="spoiler"><b>Подсекторов обложено налогом: <font color="blue">7</font></b></label>
                    <div class="spoiler">
                        <table class="wb" width="100%" cellpadding="5" cellspacing="0" align="center">
                            <tbody>
                            <tr>
                                <td class="wb" width="30" align="center">1</td>
                                <td class="wb" width="175" align="left"><a href="map.php?cx=52&amp;cy=49">Bear
                                    Mountain-<b>В</b>1</a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=149">#149 Кузница мифриловых
                                    шлемов</a></td>
                                <td class="wb" width="75" align="center">налог 55%</td>
                                <td class="wb" width="75" align="center"><b>#5722</b>&nbsp;<a
                                        href="clan_info.php?id=5722"><img
                                        src="https://dcdn.heroeswm.ru/i_clans/l_5722.gif?v=18" width="20" height="15"
                                        title="#5722 Галерея Теней" border="0" alt="#5722" align="absmiddle"></a></td>
                            </tr>
                            <tr>
                                <td class="wb" width="30" align="center">2</td>
                                <td class="wb" width="175" align="left"><a href="map.php?cx=52&amp;cy=49">Bear
                                    Mountain-<b>В</b>3</a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=147">#147 Ювелирная мифриловой
                                    печати</a>
                                </td>
                                <td class="wb" width="75" align="center">налог 55%</td>
                                <td class="wb" width="75" align="center"><b>#5722</b>&nbsp;<a
                                        href="clan_info.php?id=5722"><img
                                        src="https://dcdn.heroeswm.ru/i_clans/l_5722.gif?v=18" width="20" height="15"
                                        title="#5722 Галерея Теней" border="0" alt="#5722" align="absmiddle"></a></td>
                            </tr>
                            <tr>
                                <td class="wb" width="30" align="center">3</td>
                                <td class="wb" width="175" align="left"><a href="map.php?cx=48&amp;cy=50">Sublime
                                    Arbor-<b>В</b>1</a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=413">#413 Кузница щитов
                                    славы</a></td>
                                <td class="wb" width="75" align="center">налог 55%</td>
                                <td class="wb" width="75" align="center"><b>#387</b>&nbsp;<a
                                        href="clan_info.php?id=387"><img
                                        src="https://dcdn.heroeswm.ru/i_clans/l_387.gif?v=32" width="20" height="15"
                                        title="#387 GraveStone" border="0" alt="#387" align="absmiddle"></a></td>
                            </tr>
                            <tr>
                                <td class="wb" width="30" align="center">4</td>
                                <td class="wb" width="175" align="left"><a href="map.php?cx=48&amp;cy=50">Sublime
                                    Arbor-<b>В</b>2</a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=414">#414 Цех боевых сапог</a>
                                </td>
                                <td class="wb" width="75" align="center">налог 55%</td>
                                <td class="wb" width="75" align="center"><b>#387</b>&nbsp;<a
                                        href="clan_info.php?id=387"><img
                                        src="https://dcdn.heroeswm.ru/i_clans/l_387.gif?v=32" width="20" height="15"
                                        title="#387 GraveStone" border="0" alt="#387" align="absmiddle"></a></td>
                            </tr>
                            <tr>
                                <td class="wb" width="30" align="center">5</td>
                                <td class="wb" width="175" align="left"><a href="map.php?cx=48&amp;cy=50">Sublime
                                    Arbor-<b>З</b>1</a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=416">#416 Кузница щитов
                                    пламени</a></td>
                                <td class="wb" width="75" align="center">налог 5%</td>
                                <td class="wb" width="75" align="center"><b>#782</b>&nbsp;<a
                                        href="clan_info.php?id=782"><img
                                        src="https://dcdn.heroeswm.ru/i_clans/l_782.gif?v=80" width="20" height="15"
                                        title="#782 Темные рыцари" border="0" alt="#782" align="absmiddle"></a></td>
                            </tr>
                            <tr>
                                <td class="wb" width="30" align="center">6</td>
                                <td class="wb" width="175" align="left"><a href="map.php?cx=48&amp;cy=50">Sublime
                                    Arbor-<b>З</b>2</a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=420">#420 Завод мифриловых
                                    кольчуг</a></td>
                                <td class="wb" width="75" align="center">налог 5%</td>
                                <td class="wb" width="75" align="center"><b>#782</b>&nbsp;<a
                                        href="clan_info.php?id=782"><img
                                        src="https://dcdn.heroeswm.ru/i_clans/l_782.gif?v=80" width="20" height="15"
                                        title="#782 Темные рыцари" border="0" alt="#782" align="absmiddle"></a></td>
                            </tr>
                            <tr>
                                <td class="wb" width="30" align="center">7</td>
                                <td class="wb" width="175" align="left"><a href="map.php?cx=48&amp;cy=50">Sublime
                                    Arbor-<b>З</b>3</a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=422">#422 Цех шлемов отваги</a>
                                </td>
                                <td class="wb" width="75" align="center">налог 5%</td>
                                <td class="wb" width="75" align="center"><b>#782</b>&nbsp;<a
                                        href="clan_info.php?id=782"><img
                                        src="https://dcdn.heroeswm.ru/i_clans/l_782.gif?v=80" width="20" height="15"
                                        title="#782 Темные рыцари" border="0" alt="#782" align="absmiddle"></a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </center>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="wbwhite">
                <center><input type="checkbox" id="spoiler2"/>
                    <label for="spoiler2"><b>Подсекторов под контролем: <font color="blue">12</font></b></label>
                    <div class="spoiler">
                        <table class="wb" width="100%" cellpadding="5" cellspacing="0" align="center">
                            <tbody>
                            <tr>
                                <td class="wb" width="30" align="center"><b><font color="orange">1</font></b></td>
                                <td class="wb" width="145" align="left"><a href="map.php?cx=51&amp;cy=50"><b><font
                                        color="orange">East
                                    River-<b>В</b>1</font></b></a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=87">#87 Ювелирная колец
                                    сомнений</a></td>
                                <td class="wb" width="30" align="center">97%</td>
                            </tr>
                            <tr>
                                <td class="wb" width="30" align="center"><b><font color="orange">2</font></b></td>
                                <td class="wb" width="145" align="left"><a href="map.php?cx=51&amp;cy=50"><b><font
                                        color="orange">East
                                    River-<b>В</b>2</font></b></a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=279">#279 Рудник</a></td>
                                <td class="wb" width="30" align="center">100%</td>
                            </tr>
                            <tr>
                                <td class="wb" width="30" align="center"><b><font color="orange">3</font></b></td>
                                <td class="wb" width="145" align="left"><a href="map.php?cx=51&amp;cy=50"><b><font
                                        color="orange">East
                                    River-<b>В</b>3</font></b></a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=28">#28 Мастерская медалей
                                    отваги</a></td>
                                <td class="wb" width="30" align="center">99%</td>
                            </tr>
                            <tr>
                                <td class="wb" width="30" align="center"><b><font color="orange">4</font></b></td>
                                <td class="wb" width="145" align="left"><a href="map.php?cx=51&amp;cy=50"><b><font
                                        color="orange">East
                                    River-<b>В</b>4</font></b></a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=75">#75 Рудник</a></td>
                                <td class="wb" width="30" align="center">100%</td>
                            </tr>
                            <tr>
                                <td class="wb" width="30" align="center"><b><font color="orange">5</font></b></td>
                                <td class="wb" width="145" align="left"><a href="map.php?cx=51&amp;cy=50"><b><font
                                        color="orange">East
                                    River-<b>Ю</b>1</font></b></a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=24">#24 Завод амулетов удачи</a>
                                </td>
                                <td class="wb" width="30" align="center">100%</td>
                            </tr>
                            <tr>
                                <td class="wb" width="30" align="center"><b><font color="orange">6</font></b></td>
                                <td class="wb" width="145" align="left"><a href="map.php?cx=51&amp;cy=50"><b><font
                                        color="orange">East
                                    River-<b>Ю</b>2</font></b></a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=89">#89 Кузница мечей
                                    возмездия</a></td>
                                <td class="wb" width="30" align="center">100%</td>
                            </tr>
                            <tr>
                                <td class="wb" width="30" align="center"><b><font color="orange">7</font></b></td>
                                <td class="wb" width="145" align="left"><a href="map.php?cx=51&amp;cy=50"><b><font
                                        color="orange">East
                                    River-<b>Ю</b>3</font></b></a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=25">#25 Ферма</a></td>
                                <td class="wb" width="30" align="center">99%</td>
                            </tr>
                            <tr>
                                <td class="wb" width="30" align="center"><b><font color="orange">8</font></b></td>
                                <td class="wb" width="145" align="left"><a href="map.php?cx=51&amp;cy=50"><b><font
                                        color="orange">East
                                    River-<b>Ю</b>4</font></b></a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=300">#300 Лесопилка</a></td>
                                <td class="wb" width="30" align="center">97%</td>
                            </tr>
                            <tr>
                                <td class="wb" width="30" align="center"><b><font color="orange">9</font></b></td>
                                <td class="wb" width="145" align="left"><a href="map.php?cx=51&amp;cy=50"><b><font
                                        color="orange">East
                                    River-<b>З</b>1</font></b></a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=23">#23 Сталелитейный цех</a>
                                </td>
                                <td class="wb" width="30" align="center">93%</td>
                            </tr>
                            <tr>
                                <td class="wb" width="30" align="center"><b><font color="orange">10</font></b></td>
                                <td class="wb" width="145" align="left"><a href="map.php?cx=51&amp;cy=50"><b><font
                                        color="orange">East
                                    River-<b>З</b>2</font></b></a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=321">#321 Рудник</a></td>
                                <td class="wb" width="30" align="center">93%</td>
                            </tr>
                            <tr>
                                <td class="wb" width="30" align="center"><b><font color="orange">11</font></b></td>
                                <td class="wb" width="145" align="left"><a href="map.php?cx=51&amp;cy=50"><b><font
                                        color="orange">East
                                    River-<b>З</b>3</font></b></a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=26">#26 Лесопилка</a></td>
                                <td class="wb" width="30" align="center">96%</td>
                            </tr>
                            <tr>
                                <td class="wb" width="30" align="center"><b><font color="orange">12</font></b></td>
                                <td class="wb" width="145" align="left"><a href="map.php?cx=51&amp;cy=50"><b><font
                                        color="orange">East
                                    River-<b>З</b>4</font></b></a></td>
                                <td class="wb" align="left"><a href="object-info.php?id=342">#342 Кузница мечей
                                    отваги</a></td>
                                <td class="wb" width="30" align="center">100%</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </center>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="wbwhite">
                <input type="checkbox" id="spoiler3"/>
                <label for="spoiler3"><b>Информация о клане</b></label>
                <div class="spoiler">
                    <img width="200" height="200" border="0" align="right"
                         src="https://dcdn.heroeswm.ru/i_clans/em_1519.jpg?v=11"><br>"УКРАЇНА"______________________________________________________"УКРАЇНА"<br>
                    __________________________________88__________________________________<br>
                    _____________________88___________88___________88_____________________<br>
                    _____________________8888_________88_________8888_____________________<br>
                    _____________________88_88________88________88_88_____________________<br>
                    _____________________88__88_______88_______88__88_____________________<br>
                    _____________________88__888______88______888__88_____________________<br>
                    _____________________88___88______88______88___88_____________________<br>
                    _____________________88___888_____88_____888___88_____________________<br>
                    _____________________88____88_____88_____88____88_____________________<br>
                    _____________________88____88_____88_____88____88_____________________<br>
                    _____________________88____88_____88_____88____88_____________________<br>
                    _____________________88____88____8888____88____88_____________________<br>
                    _____________________88___888____8888____888___88_____________________<br>
                    _____________________88__88_____888888_____88__88_____________________<br>
                    _____________________888888_____88__88_____888888_____________________<br>
                    _____________________88__888888888__888888888__88_____________________<br>
                    _____________________88______88__8888__88______88_____________________<br>
                    _____________________88______88___88___88______88_____________________<br>
                    _____________________8888888888888888888888888888_____________________<br>
                    _____________________________888__88__888_____________________________<br>
                    ______________________________888_88_888______________________________<br>
                    _______________________________888__888_______________________________<br>
                    ________________________________888888________________________________<br>
                    __________________________________88__________________________________<br>
                    "УКРАЇНА"______________________________________________________"УКРАЇНА"<br>
                    <br>
                    Слава Героям!<br>
                    <br>
                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~<br>
                    УМОВИ ВСТУПУ ДО КЛАНУ:<br>
                    - 18+ бойовий рівень. 14+ якщо дозволить голова БК.<br>
                    - Мінімум 9 ГЛ. Достатньо дуже рідкісних юнітів для ГЛ івенту.<br>
                    - 18+ бойовий рівень обов'язкова участь в 5 податкових боях у місяць.<br>
                    - Топи кланових івентів.<br>
                    - Наявність фулу на свій рівень та 50к золота на рахунку. <br>
                    - Активне бажання воювати за податки + участь в перехватах і пве захистах.<br>
                    - Сплатити вступний внесок у розмірі 5000 золотих (в період турнірів та івентів з нагородами -
                    15000)<br>
                    - Для доступу до кланового чату мати програму Skype.<br>
                    <br>
                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~_ІСТОРІЯ_КЛАНУ_~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~<br>
                    <br>
                    28-10-08 13:33: Клан "Украина" заснований героєм nasarchik.<br>
                    06-03-09 00:42: Клан оголошений бойовим.<br>
                    <br>
                    Участь клану на війнах:<br>
                    Війна з Гномами - 30 місце (захоплено 2 сектори);<br>
                    Війна з Королівством - 6 місце (захоплено 18 секторів, 3 місце по захопленню);<br>
                    Війна із Степовими Варварами - 11 місце (захоплено 16 секторів, 4 місце по захопленню);<br>
                    <br>
                    Наш клан завжди приймає активну участь в івентах, стабільно займаючи місця в ТОП-5 рейтингів.<br>
                    Найкращі результати на сьогоднішній день:<br>
                    Контрабандисти - 1 місце<br>
                    Облава - 1 місце<br>
                    Гробница Луны - 1 місце<br>
                    Розбійні напади - 4 місце<br>
                    Портала часу - 1 місце<br>
                    Сурвілурги в замку - 4 місце<br>
                    Клан огня - 2 місце<br>
                    Тайная операция - 1 місце<br>
                    Древний ритуал - 1 місце<br>
                    Сезон охоти - 2 місце<br>
                    Охота на Гринча - 1 місце<br>
                    Охота на пиратов - 3 місце<br>
                    Древний ритуал - 3 місце<br>
                    <br>
                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~_МАЙСТРИ_КЛАНУ_~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~<br>
                    <br>
                    Ковалі клану:<br>
                    90за100 - jekerson, Дата АС, Pandorra, EdvardI.<br>
                    90за101 - Йопсель, GaRDeNiS, Раундап, Pol_BH, Zeleax, Власлав, DropK, Bar_barian.<br>
                    90за102 - Sarnydeath, DenisK.<br>
                    <br>
                    Крафтери:<br>
                    Sarnydeath - зброя 5на11, відкат 1 пара з моду; <br>
                    Раундап - зброя 4на10, відкат 200з за елемент;<br>
                    Pol_BH - броня 5на11, юва 5на10, відкат 2 елементи на 1 мод.<br>
                    EdvardI - зброя 12, юва 11, броня 10.<br>
                    <br>
                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~_КРЕДИТУВАННЯ_В_КЛАНІ_~~~~~~~~~~~~~~~~~~~~~~~~~~~~~<br>
                    <br>
                    Кланом видаються кредити на розвиток персонажа за наступних умов:<br>
                    <br>
                    1) Герой перебуває в клані більше одного місяця.<br>
                    2) Проведено необхідну кількість захистів за останні 30 днів на момент видачі:<br>
                    &lt;5 - Кредит не надається<br>
                    5-9 - до 10.000<br>
                    10-15 - до 25.000<br>
                    16+ - до 50.000<br>
                    <br>
                    За кредитами звертатись до казначея клану.<br>
                    <br>
                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~_ПРАВИЛА БОЇВ НА СУРВИЛУРГАХ_~~~~~~~~~~~~~~~~~~~~~~~~~~~<br>
                    <br>
                    1. Порядок заповнення оборони.<br>
                    <br>
                    1 рядок) Сурвілург. Вільний вхід для 14-17<br>
                    2 рядок) Сурвілург. Вільний вхід для 16-18<br>
                    3 рядок) Сурвілург. Вільний вхід для 17-19<br>
                    4 рядок) Сурвілург. Вільний вхід для 18-20<br>
                    5 рядок) Сурвілург. Вільний вхід для 19-22<br>
                    6 рядок) Сурвілург. Вільний вхід для 20-22<br>
                    7 рядок) Також залишається для програшу сурвилурга в 1% за домовленістю. Після перших 3 хвилин вхід
                    вільний
                    у будь-який рядок.<br>
                    <br>
                    Увага! У разі атаки ворожого БК (будуть значки ворожого БК напроти 1-3 доріжок) по нашому, вхід в
                    1-3
                    доріжки лише з дозволу КООРДИНАТОРА! <br>
                    <br>
                    2. Амуніція.<br>
                    <br>
                    У захист необхідно одягати 2 крафтопушки + 2 броньки із крафтом [D10] (можна 3 крафтопухи 1
                    крафтобронь)!<br>
                    Решта артефактів із госфулу.<br>
                    <br>
                    3. Вимоги до вміння фракції.<br>
                    <br>
                    В бої заходити із 9 вмінням поточної фракції! При меншій умілці необхідно випивати зілля фракції або
                    компенсувати одяганням додаткового крафту!<br>
                    <br>
                    4. Статистика клану на сурвілургах.<br>
                    <br>
                    http://www.masati.ru/warstat/per_date/1519<br>
                    <br>
                    <br>
                    Пам'ятка:<br>
                    28-03-13 10:28: По результатам прошедших суток, за защиту предприятий (2012-05-01 2013-03-27) клан
                    получает
                    4175000 золота. (http://www.heroeswm.ru/forum_messages.php?tid=1975841)<br><br>
                </div>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="wbwhite">
                <center>
                    <input type="checkbox" id="spoiler4"/>
                    <label for="spoiler4"><b>Игроки</b></label>
                    <div class="spoiler">
                        <table class="wb" width="95%" cellpadding="3" align="center">

                            <tbody>
                            <tr>
                                <td class="wbwhite" width="30">1.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1132874"
                                                                         class="pi">nsni</a></td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Волки (Д.Н - 29.07, Сергій, Житомир)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">2.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1331014"
                                                                         class="pi">Ёльфь</a></td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Умопомрачительные (Дмитро, Київ)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">3.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=687334"
                                                                         class="pi">TaRRaN</a></td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Неадекваты (Д.Н - 09.06, Тарас, Львів)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">4.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=457541" class="pi">Скажений</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Умопомрачительные (Д.Н - 02.01, Макс, Чернігів)&nbsp;
                                </td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">5.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3859967" class="pi">Скотобой</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Легенды Украины (Д.Н - 09.06, Сергій, Дніпро)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">6.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2910947" class="pi">Темный_Лиголас</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Легенды Украины&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">7.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3455636"
                                                                         class="pi">ЮРКО</a></td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Волки (Юрій, Надвірна)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">8.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1031365" class="pi">_PawTET_</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Неадекваты (Павло, Тернопіль)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">9.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1371273" class="pi">Sarnydeath</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Характерники (Д.Н - 05.06, Вова, Сарни)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">10.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1330510"
                                                                         class="pi">паняша</a></td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Волки (Юрій, Львів)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">11.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2412566" class="pi">гном-игорь</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Умопомрачительные&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">12.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2608947" class="pi">Golden__Eagle</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Умопомрачительные (Ігор, Дрогобич) ТОРГ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">13.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1753492"
                                                                         class="pi">M-25</a></td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Волки&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">14.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6163850" class="pi">_Tayson_</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Легенды Украины Олександр&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">15.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=865036"
                                                                         class="pi">Vigulfr</a></td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Умопомрачительные (Віктор, Київ)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">16.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2791389" class="pi">Bossyak</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Волки (Д.Н - 23.02, Вова, Вінниця)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">17.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1472408" class="pi">El_Terrible</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Волки (Д.Н - 23.08, Андрій)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">18.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6468634" class="pi">Jakov2015</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Легенды Украины&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">19.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1706955" class="pi">Bar_barian</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Волки (Д.Н - 09.01, Артем, Харків) @&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">20.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1264523" class="pi">f-oleg-f</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Неадекваты (Роман, Самбір)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">21.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1841076" class="pi">Kozak-Ivan</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Умопомрачительные&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">22.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5718352"
                                                                         class="pi">Legail</a></td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Неоспоримые (Євген, Київ) @&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">23.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1609283"
                                                                         class="pi">DokZ</a></td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Волки @&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">24.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5661521"
                                                                         class="pi">Г-ном</a></td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Святые @&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">25.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=4108158" class="pi">SlaveUA</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Волки (Ярослав, Тернопіль)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">26.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2165984" class="pi">kolibris</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Святые (Д.Н - 02.09, Роман, Бережани)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">27.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1985354" class="pi">DARKPHOENIX36</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Святые&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">28.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=343914"
                                                                         class="pi">Рысь</a></td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Характерники (Д.Н - 02.12, Наташа)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">29.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1087549" class="pi">Герон21</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Неоспоримые (Д.Н - 21.05, Коля, Рубіжне)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">30.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1586528" class="pi">VVPBest</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Непреклонные (Д.Н-28.05,Віталій,Львів) -@&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">31.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5146524" class="pi">I_ARHANGEL_I</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;9 ГЛ Неоспоримые&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">32.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2038829" class="pi">-Hustler-</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Неоспоримые&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">33.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3000882"
                                                                         class="pi">MURHIK</a></td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Неадекваты (Д.Н - 31.08, Слава, Умань)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">34.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2967706" class="pi">A-MeTeOr-</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Характерники (Д.Н - 21.12, Андрій, Підгайці)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">35.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=707181" class="pi">Князь_Ярема</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">22</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Характерники -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">36.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=188550" class="pi">WizardTest</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Неадекват&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">37.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=476821"
                                                                         class="pi">jeen1</a></td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Умопомрачительные&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">38.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5973696" class="pi">Dannika_</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Святые&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">39.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1980948" class="pi">JIeonapg</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Неадекваты&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">40.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2501607" class="pi">Sava199401</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">15</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Легенды Украины (Д.Н - 01.08.)-@&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">41.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5247113"
                                                                         class="pi">Gizi</a></td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Умопомрачительные&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">42.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6132603" class="pi">vvvv1111</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Легенды Украины&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">43.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2296633" class="pi">sweetfire</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Волки -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">44.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1149441" class="pi">Gardenia</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Неоспоримые&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">45.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=671936" class="pi">GaRDeNiS</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Волки&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">46.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5383966"
                                                                         class="pi">Nub_01</a></td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Характерники&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">47.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=150113" class="pi">тюф</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">22</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Характерники&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">48.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=7028884" class="pi">alexanderknaz</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Волки&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">49.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3560566" class="pi">Super_Ukraine</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">22</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Характерники&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">50.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2463365" class="pi">Раундап</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Святые (Владимир, Эстония)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">51.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=48469"
                                                                         class="pi">Йопсель</a></td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Неоспоримые&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">52.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=7285188" class="pi">keks511</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">15</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Непреклонные&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">53.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1888399"
                                                                         class="pi">RVADAK</a></td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Святые&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">54.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2256764" class="pi">дохторр</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Легенды Украины -@&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">55.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3811199" class="pi">Iskander3</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Непреклонные&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">56.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3393333"
                                                                         class="pi">KuBBy</a></td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Легенды Украины&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">57.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1787287" class="pi">BlackSignifer</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Неадекваты&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">58.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3732586" class="pi">Xlopci_z_Lisy</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Непреклонные&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">59.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1566098" class="pi">pahahontes</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">22</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Характерники -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">60.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=33375" class="pi">kam</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Неадекваты&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">61.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=801698" class="pi">NeverDeath1993</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Волки -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">62.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=894573"
                                                                         class="pi">Tomax</a></td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Легенды Украины&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">63.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3917905" class="pi">MrSidCrosby</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Непреклонные (Василь, Тернопіль)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">64.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6123522" class="pi">гномы
                                    14</a></td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Неадекваты&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">65.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6752072"
                                                                         class="pi">Лёвка</a></td>
                                <td class="wbwhite" width="10" align="center">15</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Непреклонные -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">66.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1388017" class="pi">KIPRIDA_Z</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Святые -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">67.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3222448" class="pi">Гигантомахия</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Неадекваты&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">68.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=399744"
                                                                         class="pi">Sovan</a></td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Святые&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">69.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1182339" class="pi">BangFire</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Волки&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">70.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=123074"
                                                                         class="pi">Я-ИГОРЬ</a></td>
                                <td class="wbwhite" width="10" align="center">22</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Характерники (Ігор, Житомир)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">71.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2558997" class="pi">СтальнойМолот</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Святые&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">72.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1952110" class="pi">MegaGlobus</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Волки -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">73.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3114497" class="pi">Абигона</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Неадекваты&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">74.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6496276" class="pi">Диалектик</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Святые (Виктор)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">75.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6490286" class="pi">Deja_Vu</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Легенды Украины&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">76.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5140290" class="pi">Zalushenets</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Непреклонные -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">77.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3985411" class="pi">D_Wolf_</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Неоспоримые (Дмитро, Рівне)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">78.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2902019" class="pi">maxotto</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Непреклонные&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">79.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3006576"
                                                                         class="pi">снобик</a></td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Характерники (Д.Н - 23.05, Юра, Дрогобич) -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">80.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6983930" class="pi">Elektron</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Неоспоримые -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">81.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6261638" class="pi">RA-V-EN</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Легенды Украины&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">82.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2180280" class="pi">Человек_синяК</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Умопомрачительные&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">83.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2574241" class="pi">ден-герой</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">22</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Характерники. Лидер&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">84.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=573522" class="pi">Vindrider</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Неадекваты&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">85.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1867010" class="pi">РыжийБоб</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Неадекваты (Д.Н - 29.03, Едуард, Чернівці)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">86.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5185386" class="pi">Evilhant</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">15</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Непреклонные -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">87.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=4079265" class="pi">кабан111</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Волки -@&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">88.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=7008204"
                                                                         class="pi">Bobolo</a></td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Непреклонные (Д.Н - 22.05, Богдан, Київ)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">89.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1349333" class="pi">Торговец2</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Легенды Украины&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">90.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2533699" class="pi">Рейнджер777</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Неадекваты&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">91.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=362374"
                                                                         class="pi">Беня</a></td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Характерники&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">92.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2164199" class="pi">_СЕРЫЙ_ВОЛЧАРА_</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Волки. Лидер (Сергій, Київ)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">93.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2360903" class="pi">Strange_Elf</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Умопомрачительные&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">94.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3428322" class="pi">Megabober</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Умопомрачительные (Д.Н - 31.12, Олег, Львів)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">95.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=547725" class="pi">ИльяТаров</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Характерники&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">96.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=4179489" class="pi">Дмитрий</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">22</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Характерники -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">97.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1172170" class="pi">Darklena</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Неоспоримые @&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">98.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6448414" class="pi">Ultralisk</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Умопомрачительные&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">99.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=23830"
                                                                         class="pi">kurt-</a></td>
                                <td class="wbwhite" width="10" align="center">22</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Характерники&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">100.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=280227" class="pi">SpiritHorse</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Характерники&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">101.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=45977"
                                                                         class="pi">Левиофан</a></td>
                                <td class="wbwhite" width="10" align="center">22</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Характерники&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">102.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=7243949" class="pi">rpu3JIu</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">15</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Неоспоримые (Д.Н - 10.01, Максим, Воронеж)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">103.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5465922" class="pi">рыба
                                    кит</a></td>
                                <td class="wbwhite" width="10" align="center">15</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Неоспоримые. Лидер&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">104.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=353847"
                                                                         class="pi">Тралл</a></td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Неоспоримые&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">105.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2682757" class="pi">-Brodyaga-</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Характерники (Д.Н - 19.04, Олег, Луцьк)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">106.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6887357" class="pi">HardForAll</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Непреклонные&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">107.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1137853"
                                                                         class="pi">DenisK</a></td>
                                <td class="wbwhite" width="10" align="center">22</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Легенды -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">108.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=7297447"
                                                                         class="pi">Lord1k</a></td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Умопомрачительные&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">109.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=162653" class="pi">jekerson</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">22</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Неадекваты -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">110.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3784205"
                                                                         class="pi">Orkan</a></td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Характерники -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">111.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6724352" class="pi">VivaUkraine</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Непреклонные Андрій, м.Київ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">112.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=384833" class="pi">Бумбарик</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">22</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Характерники&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">113.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=380417" class="pi">MasterDream</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Непреклонные&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">114.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5238365"
                                                                         class="pi">Ромчик</a></td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Умопомрачительные&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">115.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1392352"
                                                                         class="pi">Dreus</a></td>
                                <td class="wbwhite" width="10" align="center">22</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Непреклонные&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">116.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5951703" class="pi">Sacura-Mak</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;12 ГЛ Умопомрачительные&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">117.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=445452"
                                                                         class="pi">oleh23</a></td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;10 ГЛ @&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">118.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2100246" class="pi">--LION4IK--</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;12 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">119.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2360306" class="pi">e_s_a_u_l</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">15</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">120.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=55093"
                                                                         class="pi">Pol_BH</a></td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;11 ГЛ (Поль Рублёвский, Москва-Воронеж х.d.) -@&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">121.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1553097" class="pi">MagVITYA</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">122.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2690161" class="pi">xvxPAINxvx</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;10 ГЛ Неадекват, стальные яйца&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">123.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3560998" class="pi">ельфист</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;12 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">124.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1890149" class="pi">-shadi777-</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;10 ГЛ @&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">125.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=587170"
                                                                         class="pi">janjak</a></td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">126.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2215805" class="pi">utyyflsq</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;12 ГЛ (Д.Н - 10.01, Геннадій, Київ) -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">127.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6826244" class="pi">Super-Dragon</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;12 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">128.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5993972"
                                                                         class="pi">Ркерия</a></td>
                                <td class="wbwhite" width="10" align="center">15</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">129.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=4198512" class="pi">АЛконафт_</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">130.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1477423" class="pi">Detrevill</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">131.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5621035" class="pi">_СТЕРХ_</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">132.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1233123" class="pi">EdvardI</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">133.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6722246"
                                                                         class="pi">Nexik</a></td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">134.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=7197821" class="pi">Гроза_ГВД</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">15</td>
                                <td class="wbwhite">&nbsp;9 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">135.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=938382"
                                                                         class="pi">Zeleax</a></td>
                                <td class="wbwhite" width="10" align="center">15</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">136.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6676146" class="pi">NoobFromUA</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">137.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6209092" class="pi">Дата
                                    АС</a></td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;11 ГЛ (Света, Москва)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">138.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=770249" class="pi">Gudini_mudini</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">139.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5480160" class="pi">_Чертяка_</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;10 ГЛ -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">140.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3498784" class="pi">Власлав</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;10 ГЛ (Денис, Горишние Плавни) -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">141.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5608009"
                                                                         class="pi">Керуак</a></td>
                                <td class="wbwhite" width="10" align="center">15</td>
                                <td class="wbwhite">&nbsp;11 ГЛ @&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">142.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5167462" class="pi">Priomus</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;11 ГЛ (Д.Н - 02.11, Василь)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">143.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3416605"
                                                                         class="pi">Agrael</a></td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;9 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">144.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2022437" class="pi">SuperVetal</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;9 ГЛ (Д.Н - 22.09, Віталій, Вінниця) -@&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">145.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6111895" class="pi">Pandorra</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;11 ГЛ (Евгений)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">146.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=7217038"
                                                                         class="pi">Psih0</a></td>
                                <td class="wbwhite" width="10" align="center">15</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">147.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5277945" class="pi">Tactic
                                    Man</a></td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">148.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=7345584" class="pi">gorynich01</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">12</td>
                                <td class="wbwhite">&nbsp;8 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">149.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=967715"
                                                                         class="pi">SanATi</a></td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">150.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=586010"
                                                                         class="pi">illyok2</a></td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">151.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=305806" class="pi">spectral_tank</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;9 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">152.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=346931" class="pi">YUPITER_1979</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">153.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5542512"
                                                                         class="pi">777S</a></td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">154.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6949074" class="pi">чеб1983</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">155.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6691842" class="pi">Маркус
                                    Хаос</a></td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;12 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">156.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6262549" class="pi">Красный-Череп</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;10 ГЛ -&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">157.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6480891"
                                                                         class="pi">TopKek</a></td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">158.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6740104" class="pi">Drake2015</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;12 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">159.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6317147" class="pi">Dad_ender</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">160.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3929910" class="pi">ДобриденьДякую</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">161.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2419584" class="pi">кн_Аскольд</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">162.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3215580" class="pi">Rustik95</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">163.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=4471369"
                                                                         class="pi">Old</a></td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;3 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">164.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=756733"
                                                                         class="pi">фэном</a></td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">165.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=67118" class="pi">SODA</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;9 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">166.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5125596"
                                                                         class="pi">Dark_D</a></td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;7 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">167.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2152068" class="pi">vad1502</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;9 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">168.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6784143" class="pi">Gernuculu</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">14</td>
                                <td class="wbwhite">&nbsp;8 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">169.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2897299" class="pi">Flaterry</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;9 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">170.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=7304652"
                                                                         class="pi">DropK</a></td>
                                <td class="wbwhite" width="10" align="center">14</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">171.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=7175444"
                                                                         class="pi">шарий</a></td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">172.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=4485904"
                                                                         class="pi">Hewrin</a></td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Eng&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">173.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1445486"
                                                                         class="pi">DIKRO</a></td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">174.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5207846" class="pi">граф
                                    Сен-Жермен</a></td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">175.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1444305" class="pi">VETALLL2000</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">176.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2940692"
                                                                         class="pi">Redh</a></td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">177.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=7214767" class="pi">karinusja</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">15</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">178.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3990"
                                                                         class="pi">Страус</a></td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">179.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2798829"
                                                                         class="pi">Lev82</a></td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">180.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3372711"
                                                                         class="pi">egos08</a></td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;9 ГЛ Ольга&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">181.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2190182" class="pi">Anasteyshan</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;Настя главный пупсик 11гл&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">182.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=4040510" class="pi">JustGenious</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">183.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=4550110"
                                                                         class="pi">Modi</a></td>
                                <td class="wbwhite" width="10" align="center">20</td>
                                <td class="wbwhite">&nbsp;11 ГЛ Eng&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">184.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1405466" class="pi">zexman1</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">21</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">185.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3413128" class="pi">Бургундец</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">186.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=390999"
                                                                         class="pi">Inia</a></td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;11 ГЛ (Катя)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">187.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=6421100" class="pi">DARK
                                    GUZUL</a></td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">188.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=4883235" class="pi">Coca-Cola</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">189.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=666786"
                                                                         class="pi">Бульбяш</a></td>
                                <td class="wbwhite" width="10" align="center">19</td>
                                <td class="wbwhite">&nbsp;11 ГЛ (Евгений, Саратов)&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">190.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=7088044"
                                                                         class="pi">IVAH</a></td>
                                <td class="wbwhite" width="10" align="center">13</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">191.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5717387" class="pi">Осиновый
                                    Кол</a></td>
                                <td class="wbwhite" width="10" align="center">18</td>
                                <td class="wbwhite">&nbsp;12 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">192.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=5533560" class="pi">Draconem</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">193.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=525453" class="pi">FERRAR1st</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">22</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">194.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=1956630" class="pi">сашачёрны</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">195.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2957080" class="pi">Alex2011</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;11 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">196.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=2960887"
                                                                         class="pi">Эфекл</a></td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">197.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=7274270" class="pi">Domovenok</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">9</td>
                                <td class="wbwhite">&nbsp;9 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">198.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=114093"
                                                                         class="pi">DaNick</a></td>
                                <td class="wbwhite" width="10" align="center">22</td>
                                <td class="wbwhite">&nbsp;12 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">199.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=4711710"
                                                                         class="pi">Murali</a></td>
                                <td class="wbwhite" width="10" align="center">17</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td class="wbwhite" width="30">200.</td>
                                <td class="wbwhite" width="150">&nbsp;<a href="pl_info.php?id=3011688" class="pi">дядя_В0ва</a>
                                </td>
                                <td class="wbwhite" width="10" align="center">16</td>
                                <td class="wbwhite">&nbsp;10 ГЛ&nbsp;</td>
                                <td class="wbwhite" width="30" align="right">&nbsp;<font color="green">50</font>&nbsp;
                                </td>
                            </tr>
                            </tbody>

                        </table>
                    </div>
                </center>

            </td>
        </tr>
        </tbody>

    </table>
</div>

           






                     `;
        document.getElementById("android_container").insertAdjacentHTML("afterbegin",
            myDiv);
    }

    function setStyle() {
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            .myPolzynok {
              -webkit-appearance: none;
              margin: 18px 0;
              width: 40%;
            }
            table.ololo td {
                text-align: center;
            }
            table.ololo {
              border-collapse: collapse;
            }
            table.ololo td {
              border: 2px solid #c0deff; 
            }
            table.ololo tr:first-child td {
              border-top: 0;
            }
            table.ololo tr td:first-child {
              border-left: 0;
            }
            table.ololo tr:last-child td {
              border-bottom: 0;
            }
            table.ololo tr td:last-child {
              border-right: 0;
            }
            .myPolzynok:focus {
              outline: none;
            }
            .myPolzynok:focus {
              outline: none;
            }
            .myPolzynok::-webkit-slider-runnable-track {
              width: 100%;
              height: 8.4px;
              cursor: pointer;
              animate: 0.2s;
              box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
              background: #3071a9;
              border-radius: 1.3px;
              border: 0.2px solid #010101;
            }
            .myPolzynok::-webkit-slider-thumb {
              box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
              border: 1px solid #000000;
              height: 36px;
              width: 16px;
              border-radius: 3px;
              background: #ffffff;
              cursor: pointer;
              -webkit-appearance: none;
              margin-top: -14px;
            }
            .myPolzynok:focus::-webkit-slider-runnable-track {
              background: #367ebd;
            }
            .myPolzynok::-moz-range-track {
              width: 100%;
              height: 8.4px;
              cursor: pointer;
              animate: 0.2s;
              box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
              background: #3071a9;
              border-radius: 1.3px;
              border: 0.2px solid #010101;
            }
            .myPolzynok::-moz-range-thumb {
              box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
              border: 1px solid #000000;
              height: 36px;
              width: 16px;
              border-radius: 3px;
              background: #ffffff;
              cursor: pointer;
            }
            .myPolzynok::-ms-track {
              width: 100%;
              height: 8.4px;
              cursor: pointer;
              animate: 0.2s;
              background: transparent;
              border-color: transparent;
              border-width: 16px 0;
              color: transparent;
            }
            .myPolzynok::-ms-fill-lower {
              background: #2a6495;
              border: 0.2px solid #010101;
              border-radius: 2.6px;
              box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
            }
            .myPolzynok::-ms-fill-upper {
              background: #3071a9;
              border: 0.2px solid #010101;
              border-radius: 2.6px;
              box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
            }
            .myPolzynok::-ms-thumb {
              box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
              border: 1px solid #000000;
              height: 36px;
              width: 16px;
              border-radius: 3px;
              background: #ffffff;
              cursor: pointer;
            }
            .myPolzynok:focus::-ms-fill-lower {
              background: #3071a9;
            }
            .myPolzynok:focus::-ms-fill-upper {
              background: #367ebd;
            }
            .bestP {
                color: red;
                font-size: 20px !important;
                text-shadow: 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000;
            }
            thead.bestP td {
                color: red;
                border-bottom:1px solid black !important;
                border-top:1px solid black !important;
                font-size: 20px !important;
                text-shadow: 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000;
            }
            `;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
})(window);