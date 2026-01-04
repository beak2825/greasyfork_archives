// ==UserScript==
// @name         XAOS
// @version      0.6.2
// @description  Bot xaos.mobi
// @author       The Big
// @match        http://xaos.mobi/index.php?*
// @include      http://xaos.mobi/index.php?*
// @namespace    https://greasyfork.org/ru/users/1165710-the-big
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xaos.mobi
// @charset      utf-8
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474478/XAOS.user.js
// @updateURL https://update.greasyfork.org/scripts/474478/XAOS.meta.js
// ==/UserScript==
// My game: https://play.google.com/store/apps/details?id=ru.CGFROM.IdleFortress.FirstAscent&hl=en&gl=US
(function () {

    const
        e_new = (a) => document.createElement(a),
        sel_compl = (...a) => new RegExp(a.map(b => b.source).join('|')),
        sel_bool = (name) => localStorage.hasOwnProperty(name) ? (localStorage.getItem(name) == 'true' ? true : false) : false,
        sel_val = (name, val) => localStorage.hasOwnProperty(name) ? +localStorage.getItem(name) : val,
        getRandomNum = (min, max) => Math.floor(Math.random() * ((attacked ? max + attack_idle_add : max) - (attacked ? min + attack_idle_add : min)) + (attacked ? min + attack_idle_add : min)),
        get_attr = (value) => document.getElementById(value),
        check_click = (data) => localStorage.setItem(data, !sel_bool(data)),
        check_status = (check, status) => sel_bool(status) ? check.setAttribute('checked', '') : check.removeAttribute('checked')

    state_hidden()

    let
        menus = {
            "Не выбран": "0",
            "Авто-Игра": "0be2748a73fa89b2a472867ba968c12a",
            "Приключение + Арена": "8ce755fdb25a3f8ec829b417a138a3b4",
            "Колизей + Астрал": "cc38eff3a199061dfeed1535eb6503cc",
            "Мастерская (MIN)": "b97b239e53597d63ce60797c5a3c2554",
            "Грандмастер (MIN)": "db6c41233b22b6d1daw405b22b6c9c83",
            "Грандмастер (MONEY)": "caf1329eb719053934b3f8c7bdba3a26",
            "Клан. Подз.": "1738b49faccc352996b6639463f76373",
            "Атакующий": "12adfd123d5776b12f21fddf21c908c1",
            "Использование": "1801abf5f2b629d6f01169858b34ebe9"
        },
        version = '0.6.2',
        main = e_new('div'),
        btns = e_new('div'),
        check_page = e_new('div'),
        check_data = e_new('div'),
        btn = e_new('p'),
        status = e_new('p'),
        select = e_new('select'),
        speed = e_new('input'),
        menu = localStorage.getItem('menu'),
        state = sel_bool('state'),
        spec_select = sel_val('specilizacia'),
        speed_active = sel_val('speed_active', 0.2),
        speed_fix = sel_val('speed_fix', 0.2),
        attack_next = sel_val('attack_next', 0),
        army_sel = sel_bool('army_sel'),
        army_key = sel_val('army_key'),
        grand_sel = sel_bool('grand_sel'),
        clan_horney_key = sel_val('clan_horney_key'),
        clan_horney_select = sel_val('clan_horney_select'),
        time_minute = sel_val('time_minute'),
        time_active = new Date(),
        time_range = 50,
        attack_idle_add = 1000,
        wait_time = 1500,
        attacked = false,
        clicked = false,
        play_me,
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
        main.setAttribute('style', `display:block!important;visibility:visible!important;z-index: 9999;position: fixed;right: 0;bottom: 0;margin: 0 10px 25px 0;padding:5px 0;background: #232026cf;border: 1px solid #2196f3;${fontsize};`)
        main.setAttribute('id', `xaos`)
        select.setAttribute('style', style_input)
        speed.setAttribute('style', style_input)
        status.setAttribute('style', `${style_padding};`)
        btn.setAttribute('style', `${style_btn}`)
        btn.innerHTML = 'ВЫКЛ'
        btn.onclick = () => state_btn()
        select.oninput = () => localStorage.setItem('menu', select.value)
        speed.type = "number"
        speed.min = 0.1
        speed.max = 10
        speed.step = 0.01
        speed.value = Math.max(Math.min(+speed_active, +speed.max), +speed.min)
        speed.oninput = () => localStorage.setItem('speed_active', +speed.value)
        main.appendChild(status)
        btns.appendChild(select)
        btns.appendChild(speed)
        main.appendChild(btns)
        main.appendChild(btn)
        main.appendChild(check_page)
        main.appendChild(check_data)
        document.body.appendChild(main)
        document.body.style.userSelect = 'none'
        main.parentNode.insertBefore(main, document.body.children[0])

        cheks_get()
        state_hidden()
        data_hidden()
        createSelect()
        play()
        state_btn_off()
        status_get()
    }

    function createSelect() {
        Object.entries(menus).forEach(([key, value]) => {
            let item = e_new('option')
            item.innerHTML = key
            item.value = value
            if (menu == value) item.setAttribute('selected', '')
            select.appendChild(item)
        })
    }

    function btns_get() {
        btns.setAttribute('style', `display:grid;grid-template-columns:1fr auto;grid-gap:${grid_gap};padding:${padding2};`)
        btns.innerHTML = `<p style="padding:2.5px;">Режим</p><p style="padding:2.5px;">Скорость</p>`
    }

    function cheks_get() {
        let
            style_check_div = `align-items:center;display:grid;grid-template-columns:auto 1fr;grid-gap:0;padding:0 2.5px;`

        check_page.innerHTML = `<input type="checkbox" id="btn-page"><label for="btn-page">Скрыть страницу</laber>`
        check_data.innerHTML = `<input type="checkbox" id="btn-data"><label for="btn-data">Скрыть данные</laber>`
        check_page.setAttribute('style', style_check_div)
        check_data.setAttribute('style', style_check_div)

        let
            c_page = document.getElementById('btn-page'),
            c_data = document.getElementById('btn-data')

        c_page.onclick = () => {
            check_click('hidden_page')
            state_hidden()
        }
        c_data.onclick = () => {
            check_click('hidden_data')
            data_hidden()
        }

        check_status(c_page, 'hidden_page')
        check_status(c_data, 'hidden_data')
    }

    function status_get() {
        let bar = document.getElementsByClassName('butt_bott')[1].innerHTML,
            autor = `<font color="#0f5">Поддержать автора: <br>t.me/xaos_mobi_bot</font>`,
            hr = `<hr style="background:#555; border:0; height:1px"/>`,
            imageStyle = `.cust-icon{background-size: cover !important;}.cust-status{padding: 5px;display: grid;grid-template-columns: auto 1fr;grid-gap: 2.5px 5px;}.cust-status > *:nth-child(1n + 3){justify-self: center;}`,
            styleSheet = e_new("style")

        styleSheet.innerText = imageStyle
        document.head.appendChild(styleSheet)
        status.innerHTML = `<pre><b>Версия</b></pre>` + `<pre><font color="#0bf">${version}${hr}</font>${autor}${hr}</pre>` + bar
        status.setAttribute('class', 'cust-status')
    }

    function state_btn_off() {
        btn.style.background = state ? '#232026' : '#03a9f4'
        localStorage.setItem('state', state)
        btn.innerHTML = state ? 'ВКЛ' : 'ВЫКЛ'
    }

    function state_btn() {
        btn.style.background = state ? '#232026' : '#03a9f4'
        state = !state
        localStorage.setItem('state', state)
        btn.innerHTML = state ? 'ВКЛ' : 'ВЫКЛ'
        clearTimeout(play_me)
        play()
    }

    function data_hidden() {
        status.style.display = sel_bool('hidden_data') ? 'none' : ''
    }

    function state_hidden() {

        style_sheet(sel_bool('hidden_page'))
    }

    function style_sheet(status) {
        let
            css = status ? `body > * { display: none !important; visibility:collapse}` : `body > * { display: block !important; visibility:visible}`,
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style')

        head.appendChild(style)
        style.type = 'text/css'
        style.styleSheet ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css))
    }

    function gameProc() {
        status_get()

        let item,
            title = document.getElementsByClassName('title-top'),
            messg = document.getElementsByClassName('jour2'),
            title_text = title != null && title.length > 0 ? title[0].innerText : '',
            messg_text = messg != null && messg.length > 0 ? messg[0].innerText : ''

        if ((item = item_text_full('a', [/Открыть п|Забрать|Вернуться в Город|Восстановить \W+ за/]))) item_click(item)
        else switch (select.value) {
            case '8ce755fdb25a3f8ec829b417a138a3b4':
                switch (true) {
                    case title_text.indexOf('Наследие Хаоса') != -1:
                        if ((item = item_text('a', [/Пpиключeния \(\+\)/, /Aрeнa Смeрти/]))) item_click(item)
                        break
                    case title_text.indexOf('Приключения') != -1:
                        if (time_switch() && (item = item_text('a', [/На главную/]))) item_click(item)
                        else if ((item = item_text('a', [/Нанять сейчас/]))) {
                            localStorage.setItem('army_sel', false)
                            localStorage.setItem('army_key', 0)
                            item_click(item)
                        } else if ((item = item_text('a', [/Отправиться на задание|B aтaкy|Aтaкoвaть|бить eщё|Eщё рaз|Продолжить/]))) item_click(item)
                        else if ((item = item_text('a', [/На главную/]))) item_click(item)
                        break
                    case title_text.indexOf('Арена Смерти') != -1:
                        if (time_switch() && (item = item_text('a', [/На главную/]))) item_click(item)
                        else if ((item = item_text('a', [/.*боёв/, /B aтaкy|Бить прoтивникa|Закончить работу/, /Другой противник/]))) item_click(item)
                        break
                    case title_text.indexOf('Победа') != -1:
                    case title_text.indexOf('Поражение') != -1:
                        if (time_switch() && (item = item_text('a', [/На главную/]))) item_click(item)
                        else if ((item = item_text('a', [/Дрyгoй прoтивник/]))) item_click(item)
                        break
                    case title_text.indexOf('Вы погибли') != -1:
                        if ((item = item_text('a', [/Забрать награду/, /На главную/]))) item_click(item)
                        break
                    case title_text.indexOf('Армия') != -1:
                        if ((item = item_army())) item_click(item)
                        else if ((item = item_text('a', [/На главную/]))) item_click(item)
                        break
                    case title_text.indexOf('Новый Воин') != -1:
                        if ((item = item_army_sel())) item_click(item)
                        else if ((item = item_text('a', [/На главную/]))) item_click(item)
                        break
                }
                break
            case '0be2748a73fa89b2a472867ba968c12a':
                switch (true) {
                    case title_text.indexOf('Наследие Хаоса') != -1:
                        if ((item = item_text('a', [/Прeвосходствo <span style="color:red">[(]\d+ м[)]<\/span>/], true))) item_click(item)
                        else if ((item = item_number('a', [/Рюкзак\s\((\d+)\s\/\s(\d+)\)/]))) item_click(item)
                        else if ((item = item_text('a', [/Бой в Астрале [(]/]))) item_click(item)
                        else if (time_library() && (item = item_number('a', [/Бездна Хаоса/]))) item_click(item)
                        else if ((item = item_text('a', [/Шахты \(\+\)/, /Пpиключeния \(\+\)|Aрeнa Смeрти/]))) item_click(item)
                        break
                    case title_text.indexOf('Превосходство') != -1:
                        if (messg_text.indexOf('потерпел поражение!') != -1 && (item = item_text('a', [/Пропустить/]))) item_click(item)
                        else if ((item = item_text('a', [/Атаковать/]))) {
                          localStorage.setItem('attack_next', 0)
                          item_click(item)
                        }
                        else if ((item = item_text('a', [/На главную/]))) item_click(item)
                        break
                    case title_text.indexOf('Дуэль') != -1:
                        if (attack_next < 10 && (item = item_text('a', [/Aтaкoвaть/]))) {
                          localStorage.setItem('attack_next', attack_next + 1)
                          item_click(item)
                        }
                        break
                    case title_text.indexOf('Астрал') != -1:
                        if ((!time_astral() || item_text('a', [/В Астрале идёт бой/])) && (item = item_text('a', [/На главную/]))) item_click(item)
                        else if ((item = item_text('a', [/heroes\/norm\//], true))) item_click(item)
                        else if ((item = item_text('a', [/Атаковать/]))) item_click(item, 1.5)
                        break
                    case title_text.indexOf('Бездна Хаоса') != -1:
                        if (time_library() && (item = item_text('a', [/Подземная Библиотека/]))) item_click(item)
                        else if ((item = item_text('a', [/На главную/]))) item_click(item)
                        break
                    case title_text.indexOf('Подземная Библиотека') != -1:
                        if (time_library() && (item = time_library_has())) item_click(item)
                        else if ((item = item_text('a', [/На главную/]))) item_click(item)
                        break
                    case title_text.search(/Лесная Чаща|Подвал Библиотеки|Фойе Библиотеки|Малый Читальный Зал|Лунная Терраса|Исторические Архивы|Большой Читальный Зал|Звёздная Терраса|Магические Архивы|Башня/) != -1:
                        if (time_switch() && (item = item_text('a', [/На главную/]))) item_click(item)
                        else if ((item = item_text('a', [/Атаковать/, /На главную/]))) item_click(item)
                        break
                    case title_text.indexOf('Приключения') != -1:
                        if (time_switch() && (item = item_text('a', [/На главную/]))) item_click(item)
                        else if ((item = item_text('a', [/Нанять сейчас/]))) {
                            localStorage.setItem('army_sel', false)
                            localStorage.setItem('army_key', 0)
                            item_click(item)
                        } else if ((item = item_text('a', [/Отправиться на задание|B aтaкy|Aтaкoвaть|бить eщё|Eщё рaз/, /Продолжить/]))) item_click(item)
                        else if ((item = item_text('a', [/На главную/]))) item_click(item)
                        break
                    case title_text.indexOf('Арена Смерти') != -1:
                        if ((time_astral() || time_switch() && !time_astral()) && (item = item_text('a', [/На главную/]))) item_click(item)
                        else if ((item = item_text('a', [/.*боёв/, /B aтaкy|ить прoтивникa|Закончить работу/, /Другой противник/]))) item_click(item)
                        break
                    case title_text.indexOf('Победа') != -1:
                    case title_text.indexOf('Поражение') != -1:
                        if (time_switch() && (item = item_text('a', [/На главную/]))) item_click(item)
                        else if ((item = item_text('a', [/Дрyгoй прoтивник/]))) item_click(item)
                        break
                    case title_text.indexOf('Бой окончен') != -1:
                        if ((item = item_text('a', [/На главную|Вернуться/]))) item_click(item)
                        break
                    case title_text.indexOf('Вы победили!') != -1:
                    case title_text.indexOf('Вы погибли!') != -1:
                        if ((item = item_text('a', [/Забрать награду/]))) item_click(item)
                        break
                    case title_text.indexOf('Вы погибли') != -1:
                        if ((item = item_text('a', [/Забрать награду/, /На главную/]))) item_click(item)
                        break
                    case title_text.indexOf('Рюкзак') != -1:
                        if ((item = item_text_full('a', [/Улучшить/, /Разобрать/]))) item_click(item)
                        else if (item_number('div', [/Рюкзак\s\((\d+)\s\/\s(\d+)\)/]) && (item = item_text('a', [/Энергия|Жизн|Сила|Защита/]))) item_click(item)
                        else if ((item = item_text('a', [/На главную/]))) item_click(item)
                        break
                    case title_text.indexOf('Шахты') != -1:
                        if ((item = item_text_full('a', [/Рюкзак|работу|Удар киркой/, /На главную/]))) item_click(item)
                        break
                    case title_text.indexOf('Нападение') != -1:
                        if ((item = item_text('a', [/Aтaкoвaть/]))) item_click(item)
                        break
                    case title_text.indexOf('Армия') != -1:
                        if ((item = item_army())) item_click(item)
                        else if ((item = item_text('a', [/На главную/]))) item_click(item)
                        break
                    case title_text.indexOf('Новый Воин') != -1:
                        if ((item = item_army_sel())) item_click(item)
                        else if ((item = item_text('a', [/На главную/]))) item_click(item)
                        break
                }
                break
            case 'cc38eff3a199061dfeed1535eb6503cc':
                switch (true) {
                    case title_text.indexOf('Наследие Хаоса') != -1:
                        if ((item = item_text('a', [/Бой в Астрале [(]/, /Кoлизей/]))) item_click(item)
                        break
                    case title_text.indexOf('Астрал') != -1:
                        if ((!time_astral() || item_text('a', [/В Астрале идёт бой/])) && (item = item_text('a', [/На главную/]))) item_click(item)
                        else if ((item = item_text('a', [/heroes\/norm\//], true))) item_click(item)
                        else if ((item = item_text('a', [/Атаковать/]))) item_click(item, 1.5)
                        break
                    case title_text.indexOf('Колизей') != -1:
                        if (time_astral() && (item = item_text('a', [/На главную/]))) item_click(item)
                        else if ((item = item_text('a', [/Отправиться в Колизей/, /Атаковать/])))
                        {
                          item_click(item)
                          fight = true
                        }
                        break
                    case title_text.indexOf('Бой окончен') != -1:
                        if ((item = item_text('a', [/На главную|Вернуться/]))) item_click(item)
                        break
                    case title_text.indexOf('Вы победили!') != -1:
                    case title_text.indexOf('Вы погибли!') != -1:
                        if ((item = item_text('a', [/Забрать награду/]))) item_click(item)
                        break
                }
                break
            case 'b97b239e53597d63ce60797c5a3c2554':
                switch (true) {
                    case title_text.indexOf('Наследие Хаоса') != -1:
                        if ((item = item_text('a', [/Тренировочный Лагерь/]))) item_click(item)
                        break
                    case title_text.indexOf('Тренировочный Лагерь') != -1:
                        if ((item = item_text('a', [/Мастерская/]))) item_click(item)
                        break
                    case title_text.indexOf('Мастерская') != -1:
                        if (messg_text.indexOf('не хватает') == -1 && (item = item_text('a', [/Улучшить за/]))) item_click(item)
                        else if (messg_text.indexOf('не хватает') == -1 && (item = item_text('a', [/Поднять качество за/]))) item_click(item)
                        else if ((item = item_text('a', [/Перейти в новую эпоху/, /качество/, /Да, заточить/, /заточить/]))) item_click(item)
                        else if ((item = item_grand('', /эпоха \[(\d+)\]/, false)) && !grand_sel) item_click(item)
                }
                break
            case 'db6c41233b22b6d1daw405b22b6c9c83':
                switch (true) {
                    case title_text.indexOf('Наследие Хаоса') != -1:
                        if ((item = item_text('a', [/Тренировочный Лагерь/]))) item_click(item)
                        break
                    case title_text.indexOf('Тренировочный Лагерь') != -1:
                        if ((item = item_text('a', [/Грандмастер/]))) item_click(item)
                        break
                    case title_text.indexOf('Грандмастер') != -1:
                        if ((item = item_grand('diamond_gold.png', /(\d+) ур./, true)) && !grand_sel) {
                            localStorage.setItem('grand_sel', true)
                            item_click(item)
                        } else if ((item = item_grand('diamond_gold.png', /(\d+) ур./, false)) && !grand_sel) {
                            localStorage.setItem('grand_sel', true)
                            item_click(item)
                        } else if ((item = item_text('a', [/x250/, /родолжить/, /\d ур./]))) {
                            localStorage.setItem('grand_sel', false)
                            item_click(item)
                        }
                }
                break
            case 'caf1329eb719053934b3f8c7bdba3a26':
                switch (true) {
                    case title_text.indexOf('Наследие Хаоса') != -1:
                        if ((item = item_text('a', [/Тренировочный Лагерь/]))) item_click(item)
                        break
                    case title_text.indexOf('Тренировочный Лагерь') != -1:
                        if ((item = item_text('a', [/Грандмастер/]))) item_click(item)
                        break
                    case title_text.indexOf('Грандмастер') != -1:
                        if ((item = item_grand('purse.png', /(\d+) ур./, false)) && !grand_sel) {
                            localStorage.setItem('grand_sel', true)
                            item_click(item)
                        } else if ((item = item_text('a', [/x250/, /родолжить/, /\d ур./]))) {
                            localStorage.setItem('grand_sel', false)
                            item_click(item)
                        }
                        break
                }
                break
            case '1738b49faccc352996b6639463f76373':
                switch (true) {
                    case title_text.indexOf('Наследие Хаоса') != -1:
                        if ((item = item_text('a', [/Клановые Сражения/]))) item_click(item)
                        break
                    case title_text.indexOf('Клановые Сражения') != -1:
                        if ((item = item_text('a', [/Подземелья/]))) item_click(item)
                        else location.reload()
                        break
                    case title_text.indexOf('Подземелья') != -1:
                        if ((item = clan_horney())) item_click(item)
                        else {
                            localStorage.setItem('clan_horney_key', 0)
                            if ((item = item_text('a', [/На главную/]))) item_click(item)
                        }
                        break
                    case title_text.indexOf('Сложность подземелья') != -1:
                        if ((item = item_text('a', [/Отправиться/]))) item_click(item)
                        else {
                            localStorage.setItem('clan_horney_key', +clan_horney_key | 1 << +clan_horney_select)
                            if ((item = item_text('a', [/На главную/]))) item_click(item)
                        }
                        break
                    case title_text.search(/\(\d+\:\d+\)/) != -1:
                        if ((item = item_text('a', [/Атаковать|Получить награду/, /Покинуть бой/]))) item_click(item)
                        break
                }
                break
            case '12adfd123d5776b12f21fddf21c908c1':
                if ((item = item_text('a', [/Атаковать|B aтaкy|Eщё рaз|Удар|Бить/, /Следующий|Другой|Продолжить/]))) item_click(item)
                break
            case '1801abf5f2b629d6f01169858b34ebe9':
                if ((item = item_text('a', [/Энергия|Защита|Жизни|Сила|Открыть|улучшить|разобрать|Разобрать/, /продать/]))) item_click(item)
                break
            default:
                location.reload()
                break
        }
        if (clicked) return

        localStorage.setItem('speed_fix', 1)
        location.reload()
    }

    function clan_horney() {
        let items = document.querySelectorAll('a'),
            item,
            key = 0
        for (let i in items) {
            if (!(items[i] instanceof Element)) continue
            if (!items[i].innerText.match(/с \d+ ур./)) continue
            key++
            localStorage.setItem('clan_horney_select', key)
            if (clan_horney_key & (1 << key)) continue
            return items[i]
        }
    }

    function item_click(item, time) {
        localStorage.setItem('speed_fix', +time > 0 ? time : speed_active)
        clicked = true
        item.style.outline = "2px inset #8bc34a"
        item.style.borderRadius = 0
        item.click()
    }

    function item_grand(text, m, ignored) {
        let min = 0,
            dump,
            value,
            item,
            items = document.querySelectorAll('a')
        for (let i in items) {
            if (!(items[i] instanceof Element)) continue
            dump = items[i].innerHTML.match(text)
            if (dump && ignored) continue
            if (!dump && !ignored) continue
            if (!(value = items[i].innerText.match(m))) continue
            if (+value[1] > +min && min != 0) continue
            min = value[1]
            item = items[i]
        }
        return item == null ? false : item
    }

    function item_text(ham, texts, html = false) {
        let item,
            items = document.querySelectorAll(ham)

        for (let t in texts) {
            for (let i in items) {
                if (!(items[i] instanceof Element)) continue
                if (!html && !items[i].innerText.match(texts[t])) continue
                if (html && !items[i].innerHTML.match(texts[t])) continue
                item = items[i]
                break
            }
            if (item == null)
                continue

            break
        }
        return item == null ? false : item
    }
    function item_text_full(ham, texts) {
        let item,
            items = document.querySelectorAll(ham)

        texts = sel_compl(...texts)

        for (let i in items) {
            if (!(items[i] instanceof Element)) continue
            if (!items[i].innerText.match(texts)) continue
            item = items[i]
            break
        }

        return item == null ? false : item
    }

    function item_text_all(ham, texts) {
        let item,
            items = document.querySelectorAll(ham)

        for (let t in texts) {
            for (let i in items) {
                if (!(items[i] instanceof Element)) continue
                if (!items[i].innerText.match(texts[t])) continue
                item = items[i]
                item_click(item)
            }
            if (item == null)
                continue

            break
        }
    }

    function item_number(ham, texts) {
        let attr,
            item,
            items = document.querySelectorAll(ham)

        for (let t in texts) {
            for (let i in items) {
                if (!(items[i] instanceof Element)) continue
                if (!(attr = items[i].innerText.match(texts[t]))) continue
                if (+attr[1] < +attr[2]) break
                item = items[i]
                break
            }

            if (item == null)
                continue

            break
        }
        return item == null ? false : item
    }

    function time_switch() {
        if (time_active.getMinutes() == time_minute) return false
        if (time_active.getMinutes() % 5 != 0) return false
        localStorage.setItem('time_minute', time_active.getMinutes())
        return true
    }

    function time_library() {
        if (time_active.getMinutes() < 10) return false
        if (time_active.getMinutes() > 19) return false
        return true
    }

    function time_astral() {
        if (time_active.getMinutes() > 26 && time_active.getMinutes() < 31) return true
        if (time_active.getMinutes() > 56 || time_active.getMinutes() < 1) return true
        return false
    }

    function time_library_has() {
        let lvl = +document.body.innerText.match(/^(?!Монстры от )\s(\d+)\s+ур\./m)[1],
            items = document.querySelectorAll('a'),
            item_pre,
            item
        for (let i in items) {
            if (!(items[i] instanceof Element)) continue
            if (!(attr = items[i].innerText.match(/(?<=Монстры от )\d+/gm))) continue
            if (+attr[0] >= lvl - 20) continue
            item_pre = items[i]
            item = item_pre
        }
        return item ? item : item_pre
    }

    function item_army() {
        let key = -1,
            items = document.querySelectorAll('a')
        if (army_sel) return false
        if (+army_key < 0 || +army_key > 7) {
            localStorage.setItem('army_sel', false)
            localStorage.setItem('army_key', 0)
            return false
        }
        for (let i in items) {
            if (!(items[i] instanceof Element)) continue
            if (!items[i].innerText.match(/заменить/)) continue
            key++
            if (+army_key > key) continue
            localStorage.setItem('army_key', +army_key + 1)
            return items[i]
        }
    }

    function item_army_sel() {
        let items = document.querySelectorAll('a')
        for (let i in items) {
            if (!(items[i] instanceof Element)) continue
            if (window.getComputedStyle(items[i]).textDecoration.indexOf('underline solid rgb(240, 230, 140)') == -1) continue
            return items[i]
        }
    }

    function play() {
        if (!state) return
        play_me = setTimeout(function () {
            gameProc()
        }, getRandomNum((+speed_fix * 1000), (+speed_fix * 1000) + +time_range))
    }
})();