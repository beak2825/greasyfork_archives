/*eslint-env es6*/
// ==UserScript==
// @name         [UH] XAOS
// @version      1.0
// @description  Bot xaos.mobi
// @author       xxx]Denchos[xxx
// @match        http://xaos.mobi/index.php?*
// @include      http://xaos.mobi/index.php?*
// @namespace    
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xaos.mobi
// @charset      utf-8
// @downloadURL https://update.greasyfork.org/scripts/477389/%5BUH%5D%20XAOS.user.js
// @updateURL https://update.greasyfork.org/scripts/477389/%5BUH%5D%20XAOS.meta.js
// ==/UserScript==

(function () {
    const body = () => document.body,
        e_new = (a) => document.createElement(a),
        e_get = (a) => document.getElementsByClassName(a),
        e_id = (a) => document.getElementById(a),
        e_q = (a, b) => (!b ? document : b).querySelectorAll(a),
        e_app = (a, b) => a.appendChild(b),
        minut = (a) => a.getMinutes(),
        me = (a, b) => a.indexOf(b) != -1,
        e_is = (a) => a instanceof Element,
        has_p = (a) => localStorage.hasOwnProperty(a),
        match_t = (a, b) => a.innerText.match(b),
        match_h = (a, b) => a.innerHTML.match(b),
        loc_get = (a) => localStorage.getItem(a),
        loc_set = (a, b) => localStorage.setItem(a, b),
        sel_compl = (...a) => new RegExp(a.map(b => b.source).join('|')),
        sel_bool = (a) => has_p(a) ? (loc_get(a) == 'true' ? true : false) : false,
        sel_val = (a, b) => has_p(a) ? +loc_get(a) : b,
        rand = (min, max) => Math.floor(Math.random() * (max - min) + min),
        get_attr = (a) => e_id(a),
        check_click = (z) => loc_set(z, !sel_bool(z)),
        check_status = (a, b) => sel_bool(b) ? a.setAttribute('checked', '') : a.removeAttribute('checked')

    state_hidden()

    let menus = {
            "Відпочинок": "0",
            "Основне": "auto-game",
            "Арена + Пригоди": "adv + arena",
            "Колізей + Астрал": "coloss + astral",
            "Майстерня (MIN)": "master-min",
            "Грандмастер (MIN)": "grand-min",
            "Грандмастер (MONEY)": "grand-money",
            "Клан. Підземелля.": "clan-dungeon",
            "В атаку": "atker",
            "Використання": "used"
        },
        version = '1.0',
        main = e_new('div'),
        btns = e_new('div'),
        c_page = e_new('div'),
        c_data = e_new('div'),
        btn = e_new('p'),
        status = e_new('p'),
        select = e_new('select'),
        spd = e_new('input'),
        menu = loc_get('menu'),
        state = sel_bool('state'),
        spd_a = sel_val('spd_a', 0.2),
        spd_fix = sel_val('spd_fix', 0.2),
        atk_next = sel_bool('atk_next'),
        army_sel = sel_bool('army_sel'),
        army_key = sel_val('army_key'),
        grand_sel = sel_bool('grand_sel'),
        clan_h_key = sel_val('clan_h_key'),
        clan_h_sel = sel_val('clan_h_sel'),
        time_m = sel_val('time_m'),
        time_a = new Date(),
        time_range = 50,
        clicked = false,
        play,
        update,
        padding = `2.5px 5px`,
        padding2 = `0 5px`,
        grid_gap = `2.5px`,
        fontsize = `font-size:11px!important`,
        style_padding = `padding: ${padding}`,
        style_btn = `padding: 7.5px;margin:${padding};background:#232026cf;border:1px solid #2196f3`,
        style_input = `${style_padding};border: 1px solid #2196f3;${fontsize};;width:-webkit-fill-available;`
    if (document.readyState !== 'loading') content_load()
    else addEventListener("DOMContentLoaded", () => content_load())

    function content_load() {
        btns_get()
        main.setAttribute('style', `display:block!important;visibility:visible!important;z-index: 9999;position: fixed;right: 0;bottom: 0;margin: 0 10px 25px 0;padding:5px 0;background: #235fcfcf;border: 1px solid #e7d60a;${fontsize};`)
        main.setAttribute('id', `xaos`)
        select.setAttribute('style', style_input)
        spd.setAttribute('style', style_input)
        status.setAttribute('style', `${style_padding};`)
        btn.setAttribute('style', `${style_btn}`)
        btn.innerHTML = 'СТОП'
        btn.onclick = () => state_btn()
        select.oninput = () => loc_set('menu', select.value)
        spd.type = "number"
        spd.min = 0.1
        spd.max = 10
        spd.step = 0.01
        spd.value = Math.max(Math.min(+spd_a, +spd.max), +spd.min)
        spd.oninput = () => loc_set('spd_a', +spd.value)
        e_app(main, status)
        e_app(btns, select)
        e_app(btns, spd)
        e_app(main, btns)
        e_app(main, btn)
        e_app(main, c_page)
        e_app(main, c_data)
        e_app(body(), main)
        body().style.userSelect = 'none'
        main.parentNode.insertBefore(main, body().children[0])
        cheks_get()
        state_hidden()
        data_hidden()
        createSelect()
        start()
        state_btn_off()
        status_get()
    }

    function createSelect() {
        Object.entries(menus).forEach(([key, value]) => {
            let item = e_new('option')
            item.innerHTML = key
            item.value = value
            if (menu == value) item.setAttribute('selected', '')
            e_app(select, item)
        })
    }

    function btns_get() {
        btns.setAttribute('style', `display:grid;grid-template-columns:1fr auto;grid-gap:${grid_gap};padding:${padding2};`)
        btns.innerHTML = `<p style="padding:2.5px;">Режим</p><p style="padding:2.5px;">Швидкість</p>`
    }

    function cheks_get() {
        let style_check_div = `align-items:center;display:grid;grid-template-columns:auto 1fr;grid-gap:0;padding:0 2.5px;`
        c_page.innerHTML = `<input type="checkbox" id="btn-page"><label for="btn-page">Сховати сторінку</laber>`
        c_data.innerHTML = `<input type="checkbox" id="btn-data"><label for="btn-data">Сховати дані</laber>`
        c_page.setAttribute('style', style_check_div)
        c_data.setAttribute('style', style_check_div)
        let l_page = e_id('btn-page'),
            l_data = e_id('btn-data')
        l_page.onclick = () => {
            check_click('hidden_page')
            state_hidden()
        }
        l_data.onclick = () => {
            check_click('hidden_data')
            data_hidden()
        }
        check_status(c_page, 'hidden_page')
        check_status(c_data, 'hidden_data')
    }

    function status_get() {
        let bar = e_get('butt_bott')[1].innerHTML,
            autor = `<font color="#0f5">Власність клану: <br>УКРАЇНСЬКІ ГЕРОЇ</font>`,
            hr = `<hr style="background:#555; border:0; height:1px"/>`,
            imageStyle = `.cust-icon{background-size: cover !important;}.cust-status{padding: 5px;display: grid;grid-template-columns: auto 1fr;grid-gap: 2.5px 5px;}.cust-status > *:nth-child(1n + 3){justify-self: center;}`,
            styleSheet = e_new("style")
        styleSheet.innerText = imageStyle
        e_app(document.head, styleSheet)
        status.innerHTML = `<pre><b>Версія</b></pre>` + `<pre><font color="#0bf">${version}${hr}</font>${autor}${hr}</pre>` + bar
        status.setAttribute('class', 'cust-status')
    }

    function state_btn_off() {
        btn.style.background = state ? '#0f60d1' : '#03a9f4'
        loc_set('state', state)
        btn.innerHTML = state ? 'СТОП' : 'ПОЇХАЛИ'
    }

    function state_btn() {
        btn.style.background = state ? '#0f60d1' : '#03a9f4'
        state = !state
        loc_set('state', state)
        btn.innerHTML = state ? 'СТОП' : 'ПОЇХАЛИ'
        clearTimeout(play)
        clearInterval(update)
        start()
    }

    function data_hidden() {
        status.style.display = sel_bool('hidden_data') ? 'none' : ''
    }

    function state_hidden() {
        style_sheet(sel_bool('hidden_page'))
    }

    function style_sheet(status) {
        let css = status ? `body > * { display: none !important; visibility:collapse}` : `body > * { display: block !important; visibility:visible}`,
            head = document.head || document.getElementsByTagName('head')[0],
            style = e_new('style')
        e_app(head, style)
        style.type = 'text/css'
        style.styleSheet ? style.styleSheet.cssText = css : e_app(style, document.createTextNode(css))
    }

    
    
    function switch_auto_game(z) {
        if(_text('a', [/УКРАЇНСЬКІ ГЕРОЇ/, /Покинуть бой/, /Вернуться в Колизей/, /Обновить/])){ 
        switch (true) {
            case me(z.a, 'Наследие Хаоса'):
                if ((z.i = _text('a', [/Прeвосходствo <span style="color:red">[(]\d+ м[)]<\/span>/], true))) clc(z.i)
                else if ((z.i = _text('a', [/Бой в Астрале [(]/]))) clc(z.i)
                else if (_library() && (z.i = _number('a', [/Бездна Хаоса/]))) clc(z.i)
                break
            case me(z.a, 'Превосходство'):
                if ((z.i = _text('a', [/Атаковать/]))) clc(z.i)
                else if ((z.i = _text('a', [/На главную/]))) clc(z.i)
                break
            case me(z.a, 'Дуэль'):
                loc_set('atk_next', true)
                if ((z.i = _text('a', [/Aтaкoвaть/]))) clc(z.i)
                break
            case me(z.a, 'Астрал'):
                if ((!_astral() || _text('a', [/В Астрале идёт бой/])) && (z.i = _text('a', [/На главную/]))) clc(z.i)
                else if ((z.i = _text('a', [/heroes\/norm\//], false))) clc(z.i)
                else if ((z.i = _text('a', [/Атаковать/]))) clc(z.i, 1.5)
                break
            case me(z.a, 'Бездна Хаоса'):
                if (_library() && (z.i = _text('a', [/Подземная Библиотека/]))) clc(z.i)
                else if ((z.i = _text('a', [/На главную/]))) clc(z.i)
                break
            case me(z.a, 'Подземная Библиотека'):
                if (_library() && (z.i = _library_has())) clc(z.i)
                else if ((z.i = _text('a', [/На главную/]))) clc(z.i)
                break
            case z.a.search(/Лесная Чаща|Подвал Библиотеки|Фойе Библиотеки|Малый Читальный Зал|Лунная Терраса|Исторические Архивы|Большой Читальный Зал|Звёздная Терраса|Магические Архивы|Башня/) != -1:
                if (_switch() && (z.i = _text('a', [/На главную/]))) clc(z.i)
                else if ((z.i = _text('a', [/Атаковать/, /На главную/]))) clc(z.i)
                break
            case me(z.a, 'Приключения'):
                if (_switch() && (z.i = _text('a', [/На главную/]))) clc(z.i)
                else if ((z.i = _text('a', [/Нанять сейчас/]))) {
                    loc_set('army_sel', false)
                    loc_set('army_key', 0)
                    clc(z.i)
                } else if ((z.i = _text('a', [/Отправиться на задание|B aтaкy|Aтaкoвaть|бить eщё|Eщё рaз/, /Продолжить/]))) clc(z.i)
                else if ((z.i = _text('a', [/На главную/]))) clc(z.i)
                break
            case me(z.a, 'Арена Смерти'):
                if ((_astral() || _switch() && !_astral()) && (z.i = _text('a', [/На главную/]))) clc(z.i)
                else if ((z.i = _text('a', [/.*боёв/, /B aтaкy|ить прoтивникa|Закончить работу/, /Другой противник/]))) clc(z.i)
                break
            case me(z.a, 'Победа'):
            case me(z.a, 'Поражение'):
                if (_switch() && (z.i = _text('a', [/На главную/]))) clc(z.i)
                else if ((z.i = _text('a', [/Дрyгoй прoтивник/]))) clc(z.i)
                break
            case me(z.a, 'Бой окончен'):
                if ((z.i = _text('a', [/На главную|Вернуться/]))) clc(z.i)
                break
            case me(z.a, 'Вы победили!'):
            case me(z.a, 'Вы погибли!'):
                if ((z.i = _text('a', [/Забрать награду/]))) clc(z.i)
                break
            case me(z.a, 'Вы погибли'):
                if ((z.i = _text('a', [/Забрать награду/, /На главную/]))) clc(z.i)
                break
            case me(z.a, 'Рюкзак'):
                if ((z.i = _text('a', [/Улучшить/, /Разобрать/]))) clc(z.i)
                else if (!_number('div', [/Рюкзак\s\((\d+)\s\/\s(\d+)\)/], 10) && (z.i = _text('a', [/На главную/]))) clc(z.i)
                else if ((z.i = item_pack())) clc(z.i)
                else if ((z.i = _text('a', [/>|На главную/]))) clc(z.i)
                break
            case me(z.a, 'Разобрать предмет'):
                if ((z.i = _text_full('a', [/Разобрать|Разобрать/]))) clc(z.i)
                else if ((z.i = _text('a', [/На главную/]))) clc(z.i)
                break
            case me(z.a, 'Шахты'):
                if ((z.i = _text_full('a', [/Рюкзак|работу|Удар киркой/, /На главную/]))) clc(z.i)
                break
            case me(z.a, 'Нападение'):
                if ((z.i = _text('a', [/Aтaкoвaть/]))) clc(z.i)
                break
            case me(z.a, 'Армия'):
                if ((z.i = item_army())) clc(z.i)
                else if ((z.i = _text('a', [/На главную/]))) clc(z.i)
                break
            case me(z.a, 'Новый Воин'):
                if ((z.i = _army_sel())) clc(z.i)
                else if ((z.i = _text('a', [/На главную/]))) clc(z.i)
                break
        }
        }
         else{
            alert('Я не працюю в цьому клані!!!')
        }
    }
    
    
    
    
    
    
    
    
    function switch_adv_arena(z) {
        if(_text('a', [/УКРАЇНСЬКІ ГЕРОЇ/])){
            switch (true) {
            case me(z.a, 'Наследие Хаоса'):
                if ((z.i = _text('a', [/Пpиключeния \(\+\)/, /Aрeнa Смeрти/]))) clc(z.i)
                break
            case me(z.a, 'Приключения'):
                if (_switch() && (z.i = _text('a', [/На главную/]))) clc(z.i)
                else if ((z.i = _text('a', [/Позже/]))) clc(z.i)
                else if ((z.i = _text('a', [/Отправиться на задание|B aтaкy|Aтaкoвaть|бить eщё|Eщё рaз|Продолжить/]))) clc(z.i)
                else if ((z.i = _text('a', [/На главную/]))) clc(z.i)
                break
            case me(z.a, 'Арена Смерти'):
                if (_switch() && (z.i = _text('a', [/На главную/]))) clc(z.i)
                else if ((z.i = _text('a', [/.*боёв/, /B aтaкy|Бить прoтивникa|Закончить работу/, /Другой противник/]))) clc(z.i)
                break
            case me(z.a, 'Победа'):
            case me(z.a, 'Поражение'):
                if (_switch() && (z.i = _text('a', [/На главную/]))) clc(z.i)
                else if ((z.i = _text('a', [/Дрyгoй прoтивник/]))) clc(z.i)
                break
            case me(z.a, 'Вы погибли'):
                if ((z.i = _text('a', [/Забрать награду/, /На главную/]))) clc(z.i)
                break
            }
        }
        else{
            alert('Я не працюю в цьому клані!!!')
        }
    }

    

    function switch_coloss_astral(z) {
        if(_text('a', [/УКРАЇНСЬКІ ГЕРОЇ/, /Покинуть бой/, /Вернуться в Колизей/, /Обновить/])){
            switch (true) {
                case me(z.a, 'Наследие Хаоса'):
                    if ((z.i = _text('a', [/Бой в Астрале [(]/, /Кoлизей/]))) clc(z.i)
                    break
                case me(z.a, 'Астрал'):
                    if ((!_astral() || _text('a', [/В Астрале идёт бой/])) && (z.i = _text('a', [/На главную/]))) clc(z.i)
                    else if ((z.i = _text('a', [/Атаковать/]))) clc(z.i, 1.5)
                    break
                case me(z.a, 'Колизей'):
                    if (_astral() && (z.i = _text('a', [/На главную/]))) clc(z.i)
                    else if ((z.i = _text('a', [/Отправиться в Колизей/, /Атаковать/]))) {
                        clc(z.i)
                        fight = true
                    }
                    break
                case me(z.a, 'Бой окончен'):
                    if ((z.i = _text('a', [/На главную|Вернуться/]))) clc(z.i)
                    break
                case me(z.a, 'Вы победили!'):
                case me(z.a, 'Вы погибли!'):
                    if ((z.i = _text('a', [/Забрать награду/]))) clc(z.i)
                    break
            }
        }
        else{
            alert('Я не працюю в цьому клані!!!')
        }
    }

    function switch_master_min(z) {
        if(_text('a', [/УКРАЇНСЬКІ ГЕРОЇ/])){
            switch (true) {
                case me(z.a, 'Наследие Хаоса'):
                    if ((z.i = _text('a', [/Тренировочный Лагерь/]))) clc(z.i)
                    break
                case me(z.a, 'Тренировочный Лагерь'):
                    if ((z.i = _text('a', [/Мастерская/]))) clc(z.i)
                    break
                case me(z.a, 'Мастерская'):
                    if (!me(z.m, 'не хватает') && (z.i = _text('a', [/Улучшить за/]))) clc(z.i)
                    else if ((z.i = _text('a', [/Поднять качество за/]))) clc(z.i)
                    else if ((z.i = _text('a', [/Перейти в новую эпоху/, /качество/, /Да, заточить/, /заточить/]))) clc(z.i)
                    else if ((z.i = _grand('', /эпоха \[(\d+)\]/, false)) && !grand_sel) clc(z.i)
                    break
            }
        }
        else{
            alert('Я не працюю в цьому клані!!!')
        }
    }

    function switch_master_gems(z) {
        if(_text('a', [/УКРАЇНСЬКІ ГЕРОЇ/])){
            switch (true) {
                case me(z.a, 'Наследие Хаоса'):
                    if ((z.i = _text('a', [/Тренировочный Лагерь/]))) clc(z.i)
                    break
                case me(z.a, 'Тренировочный Лагерь'):
                    if ((z.i = _text('a', [/Мастерская/]))) clc(z.i)
                    break
                case me(z.a, 'Мастерская'):
                    if (!me(z.m, 'не хватает') && (z.i = _text('a', [/Улучшить за/]))) clc(z.i)
                    else if ((z.i = _text('a', [/Поднять качество за/]))) clc(z.i)
                    else if ((z.i = _text('a', [/Перейти в новую эпоху/, /качество/, /Да, заточить/, /заточить/]))) clc(z.i)
                    else if ((z.i = _grand('', /эпоха \[(\d+)\]/, false)) && !grand_sel) clc(z.i)
                    break
            }
        }
        else{
            alert('Я не працюю в цьому клані!!!')
        }
    }

    function switch_grand_min(z) {
        if(_text('a', [/УКРАЇНСЬКІ ГЕРОЇ/])){
            switch (true) {
                case me(z.a, 'Наследие Хаоса'):
                    if ((z.i = _text('a', [/Тренировочный Лагерь/]))) clc(z.i)
                    break
                case me(z.a, 'Тренировочный Лагерь'):
                    if ((z.i = _text('a', [/Грандмастер/]))) clc(z.i)
                    break
                case me(z.a, 'Грандмастер'):
                    if ((z.i = _grand('diamond_gold.png', /(\d+) ур./, true)) && !grand_sel) {
                        loc_set('grand_sel', true)
                        clc(z.i)
                    } else if ((z.i = _grand('diamond_gold.png', /(\d+) ур./, false)) && !grand_sel) {
                        loc_set('grand_sel', true)
                        clc(z.i)
                    } else if ((z.i = _text('a', [/x250/, /родолжить/, /\d ур./]))) {
                        loc_set('grand_sel', false)
                        clc(z.i)
                    }
            }
        }
        else{
            alert('Я не працюю в цьому клані!!!')
        }
    }

    function switch_grand_money(z) {
        if(_text('a', [/УКРАЇНСЬКІ ГЕРОЇ/])){
            switch (true) {
                case me(z.a, 'Наследие Хаоса'):
                    if ((z.i = _text('a', [/Тренировочный Лагерь/]))) clc(z.i)
                    break
                case me(z.a, 'Тренировочный Лагерь'):
                    if ((z.i = _text('a', [/Грандмастер/]))) clc(z.i)
                    break
                case me(z.a, 'Грандмастер'):
                    if ((z.i = _grand('purse.png', /(\d+) ур./, false)) && !grand_sel) {
                        loc_set('grand_sel', true)
                        clc(z.i)
                    } else if ((z.i = _text('a', [/x250/, /родолжить/, /\d ур./]))) {
                        loc_set('grand_sel', false)
                        clc(z.i)
                    }
                    break
            }
        }
        else{
            alert('Я не працюю в цьому клані!!!')
        }
    }

    function switch_clan_dungeon(z) {
        if(_text('a', [/УКРАЇНСЬКІ ГЕРОЇ/, /Покинуть бой/])){
            switch (true) {
                case me(z.a, 'Наследие Хаоса'):
                    if ((z.i = _text('a', [/Клановые Сражения/]))) clc(z.i)
                    break
                case me(z.a, 'Клановые Сражения'):
                    if ((z.i = _text('a', [/Подземелья/]))) clc(z.i)
                    else location.reload()
                    break
                case me(z.a, 'Подземелья'):
                    if ((z.i = clan_horney())) clc(z.i)
                    else {
                        loc_set('clan_h_key', 0)
                        if ((z.i = _text('a', [/На главную/]))) clc(z.i)
                    }
                    break
                case me(z.a, 'Сложность подземелья'):
                    if ((z.i = _text('a', [/Отправиться/]))) clc(z.i)
                    else {
                        loc_set('clan_h_key', +clan_h_key | 1 << +clan_h_sel)
                        if ((z.i = _text('a', [/На главную/]))) clc(z.i)
                    }
                    break
                case z.a.search(/\(\d+\:\d+\)/) != -1:
                    if ((z.i = _text('a', [/Атаковать|Получить награду/, /Покинуть бой/]))) clc(z.i)
                    break
            }
        }
        else{
            alert('Я не працюю в цьому клані!!!')
        }
    }

    function switch_atker(z) {
        if(_text('a', [/УКРАЇНСЬКІ ГЕРОЇ/])){
            if ((z.i = _text('a', [/Атаковать|B aтaкy|Eщё рaз|Удар|Бить/, /Атаковать|Следующий|Другой|Продолжить/]))) clc(z.i)
        }
        else{
            alert('Я не працюю в цьому клані!!!')
        }
    }

    function switch_used(z) {
        if(_text('a', [/УКРАЇНСЬКІ ГЕРОЇ/])){
            if ((z.i = _text('a', [/Атаковать|Энергия|Защита|Жизни|Сила|Открыть|улучшить|разобрать|Разобрать/, /продать/]))) clc(z.i)
        }
        else{
            alert('Я не працюю в цьому клані!!!')
        }
    }

    function game() {
        let z = {
            i: null,
            tit: null,
            msg: null,
            a: null,
            m: null
        }
        z.tit = e_get('title-top')
        z.msg = e_get('jour2')
        z.a = z.tit != null && z.tit.length > 0 ? z.tit[0].innerText : ''
        z.m = z.msg != null && z.msg.length > 0 ? z.msg[0].innerText : ''
        if ((item = _text_full('a', [/Открыть п|Забрать|Вернуться в Город|Восстановить \W+ за/]))) clc(item)
        else switch (select.value) {
            case 'adv + arena':
                switch_adv_arena(z)
                break
            case 'auto-game':
                switch_auto_game(z)
                break
            case 'coloss + astral':
                switch_coloss_astral(z)
                break
            case 'master-min':
                switch_master_min(z)
                break
            case 'master-gems':
                switch_master_gems(z)
                break
            case 'grand-min':
                switch_grand_min(z)
                break
            case 'grand-money':
                switch_grand_money(z)
                break
            case 'clan-dungeon':
                switch_clan_dungeon(z)
                break
            case 'atker':
                switch_atker(z)
                break
            case 'used':
                switch_used(z)
                break
            default:
                location.reload()
                break
        }
        if (clicked) return
        loc_set('spd_fix', 1)
        location.reload()
    }

    function clan_horney() {
        let items = e_q('a'),
            item,
            key = 0
        for (let i in items) {
            if (!e_is(items[i])) continue
            if (!match_t(items[i], /с \d+ ур./)) continue
            key++
            loc_set('clan_h_sel', key)
            if (clan_h_key & (1 << key)) continue
            return items[i]
        }
    }

    function clc(item, time) {
        loc_set('spd_fix', +time > 0 ? time : spd_a)
        clicked = true
        item.style.outline = "2px inset #8bc34a"
        item.style.borderRadius = 0
        item.click()
    }

    function _grand(text, m, ignored) {
        let min = 0,
            dump,
            value,
            item,
            items = e_q('a')
        for (let i in items) {
            if (!e_is(items[i])) continue
            dump = match_h(items[i], text)
            if (dump && ignored) continue
            if (!dump && !ignored) continue
            if (!(value = match_t(items[i], m))) continue
            if (+value[1] >= +min && min != 0) continue
            min = value[1]
            item = items[i]
        }
        return item == null ? false : item
    }

    function _text(ham, texts, html = false, group) {
        let item,
            items = e_q(ham, group)
        for (let t in texts) {
            for (let i in items) {
                if (!e_is(items[i])) continue
                if (!html && !match_t(items[i], texts[t])) continue
                if (html && !match_h(items[i], texts[t])) continue
                item = items[i]
                break
            }
            if (item == null) continue
            break
        }
        return item == null ? false : item
    }

    function _text_full(ham, texts) {
        let item,
            items = e_q(ham)
        texts = sel_compl(...texts)
        for (let i in items) {
            if (!e_is(items[i])) continue
            if (!match_t(items[i], texts)) continue
            item = items[i]
            break
        }
        return item == null ? false : item
    }

    function _text_all(ham, texts) {
        let item,
            items = e_q(ham)
        for (let t in texts) {
            for (let i in items) {
                if (!e_is(items[i])) continue
                if (!match_t(items[i], texts[t])) continue
                item = items[i]
                clc(item)
            }
            if (item == null) continue
            break
        }
    }

    function _number(ham, texts, div) {
        let attr,
            item,
            items = e_q(ham)
        for (let t in texts) {
            for (let i in items) {
                if (!e_is(items[i])) continue
                if (!(attr = match_t(items[i], texts[t]))) continue
                if (+attr[1] + div < +attr[2] && div <= +attr[2]) break
                item = items[i]
                break
            }
            if (item == null) continue
            break
        }
        return item == null ? false : item
    }

    function _switch() {
        if (minut(time_a) == time_m) return false
        if (minut(time_a) % 5 != 0) return false
        loc_set('time_m', minut(time_a))
        return true
    }

    function _library() {
        if (minut(time_a) < 10) return false
        if (minut(time_a) > 19) return false
        return true
    }

    function _astral() {
        if (minut(time_a) > 26 && minut(time_a) < 31) return true
        if (minut(time_a) > 56 || minut(time_a) < 1) return true
        return false
    }

    function _library_has() {
        let lvl = +match_t(body(), /^(?!Монстры от )\s(\d+)\s+ур\./m)[1],
            items = e_q('a'),
            item_pre,
            attr,
            item
        for (let i in items) {
            if (!e_is(items[i])) continue
            if (!(attr = match_t(items[i], /Монстры от (\d+)/))) continue
            if (+attr[1] >= lvl - 20) continue
            item_pre = items[i]
            item = item_pre
        }
        return item ? item : item_pre
    }

    function item_pack() {
        let
            items = e_get('menu_link3'),
            item

        for (let i in items) {
            if (!e_is(items[i])) continue
            if (match_t(items[i], /Имперский|самоцвет/)) continue
            item = _text('a', [/[+]|продать|разобрать/], false, items[i])
            if (!item) continue
            break
        }

        return item
    }

    function item_army() {
        let key = -1,
            items = e_q('a')
        if (army_sel) return false
        if (+army_key < 0 || +army_key > 7) {
            loc_set('army_sel', false)
            loc_set('army_key', 0)
            return false
        }
        for (let i in items) {
            if (!e_is(items[i])) continue
            if (!match_t(items[i], /заменить/)) continue
            key++
            if (+army_key > key) continue
            loc_set('army_key', +army_key + 1)
            return items[i]
        }
    }

    function _army_sel() {
        let items = e_q('a')
        for (let i in items) {
            if (!e_is(items[i])) continue
            if (window.getComputedStyle(items[i]).textDecoration.indexOf('underline solid rgb(240, 230, 140)') == -1) continue
            return items[i]
        }
    }

    function start() {
        if (!state) return
        play = setTimeout(() => game(), rand((+spd_fix * 1000), (+spd_fix * 1000) + +time_range))
        update = setInterval(() => location.reload(), 15000)
    }
})();
