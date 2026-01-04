// ==UserScript==
// @name         Список команд
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Список команд боевого этапа колотуна копыт
// @author       signumguilt
// @match        https://catwar.su/cw3/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catwar.su
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483325/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA%20%D0%BA%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/483325/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA%20%D0%BA%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fight_panel = document.getElementById('fightPanel');
    const fight_log = document.getElementById('fightLog');

    var team_list = document.createElement('div');
    team_list.id = 'teamlist';

    fight_panel.appendChild(team_list);

    team_list.innerHTML = '<b>ВОЛКИ:</b> Паучище, Бессмертник, Дар, Хрупенький, Мохноногий Сыч, Яркая, Клинохвостый, Остролапик, Бошка, Вертунья, Враноперая, Ряска, Глыба, Обольстившийся, Сонливушек, Юнец, Янтарное Сердце, Вертлявая Пиявка, Вздорный, Лохматолисёнок, Попытка<br><br><b>КАРИБУ:</b> Быстрянка, Крушение, Судак, Калужница, Озарённый Солнцем, Заплутавший Скиталец, Клюквинка, Ежище, Мрачносвод, Окрасивший Поднебесье, Древоточец, Пар, Забытье';

})();