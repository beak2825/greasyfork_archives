// ==UserScript==
// @name         Цветовая подсветка в данных тс
// @namespace https://greasyfork.org/users/191824
// @version      0.6.14
// @description  ///ДКК ///ДКБ
// @author       Gusev
// @include       https://taximeter-admin.taxi.yandex-team.ru/dkk*
// @include       https://taximeter-admin.taxi.yandex-team.ru/qc?exam=branding
// @include       https://taximeter-admin.taxi.yandex-team.ru/dkb/chair
// @include       https://taximeter-admin.taxi.yandex-team.ru/dkb/booster
// @downloadURL https://update.greasyfork.org/scripts/375070/%D0%A6%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%BF%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%B2%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85%20%D1%82%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/375070/%D0%A6%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%BF%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%B2%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85%20%D1%82%D1%81.meta.js
// ==/UserScript==

let url = document.location.href

function setColor(e, params) {

    const cities = [
        "Хельсинки",
        "Белград",
        'Таллин', "Тарту",
        "Вильнюс",
        "Бухарест",
        "Ташкент", "Наманган",
        "Баку",
        "Минск", "Гомель", "Гродно", "Жодино", "Речица", "Борисов", "Могилев", "Витебск", "Бобруйск", "Брест", "Барановичи", "Орша", "Беларусь", "Солигорск", "Мозырь", "Слуцк", "Лида", "Молодечно",
        "Кишинёв",
        "Рига", "Даугавпилс", "Лиепая", "Валмиера", "Вентспился", "Елгава",
        "Днепр", "Запорожье", "Киев", "Кривой Рог", "Львов", "Николаев", "Одесса", "Харьков",
        "Армавирская область", "Араратская область", "Ванадзор", "Горис", "Гюмри", "Ереван", "Капан", "Котайкская область",
        "Батуми", "Кутаиси", "Рустави", "Тбилиси",
        "Бишкек", "Ош",
        "Актау", "Актобе", "Алматы", "Астана", "Атырау", "Караганда", "Кокшетау", "Костанай", "Кызылорда", "Павлодар", "Петропавловск", "Семей", "Темиртау", "Тараз", "Туркестан", "Уральск", "Усть-Каменогорск", "Шымкент", "Экибастуз", "Жезказган", "Талдыкорган",
        "Тель-Авив"
    ]

    const regions = [
        '01',
        '02', '102', '702',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13', '113',
        '14',
        '15',
        '16', '116', '716',
        '17',
        '18',
        '19',
        '20',
        '21', '121',
        '22', '122',
        '23', '93', '123', '193',
        '24', '124', '84', '88',
        '25', '125',
        '26', '126',
        '27',
        '28',
        '29',
        '30',
        '31',
        '32',
        '33',
        '34', '134',
        '35',
        '36', '136',
        '37',
        '38', '138', '85',
        '39',
        '40',
        '41',
        '42', '142',
        '43',
        '44',
        '45',
        '46',
        '47', '147',
        '48',
        '49',
        '50', '90', '150', '190', '750', '790',
        '51',
        '52', '152',
        '53',
        '54', '154',
        '55', '155',
        '56', '156',
        '57',
        '58',
        '59', '159', '81',
        '60',
        '61', '161', '761',
        '62',
        '63', '163', '763',
        '64', '164',
        '65',
        '66', '96', '196',
        '67',
        '68',
        '69',
        '70',
        '71',
        '72',
        '73', '173',
        '74', '174', '774',
        '75', '80',
        '76',
        '77', '97', '99', '177', '197', '777', '799', '797', '199',
        '78', '178', '98', '198',
        '79',
        '82',
        '83',
        '86', '186',
        '87',
        '89',
        '92',
        '94',
        '95',
        '80', '81', '84', '88'
    ]

    function mark(c, v, fz='17', cl='#fff') {
        var el = $('<span/>', {
            css: {
                display: 'inline-block',
                padding: '0 10px',
                border: '1px solid rgb(128,128,128)',
                borderRadius: '5px',
                backgroundColor: v,
                fontSize: fz+'px',
                color: cl
            },
            class: 'car-color',
            text: c,
        }).prop('outerHTML');
        src = src.replace(c, el);
        $('#info').html(src);
        $('.car-color').bind('click', function () {
            $(this).css({ backgroundColor: 'transparent', border: 'none', padding: '0' })
        });
    };

    let src = $('#info').html();
    //let color = src.match(/[\s\S]*\d{4,4}\s(.+?)&nbsp;\(/) || []
    let color = src.match(/[\s\S]*\d{4,4}\s(.+?)\s\(/)
    if (color == null) return
    let numberCar = src.match(/\((\S+?)\)&nbsp;/)


    if (url.includes('qc?exam=branding')) {
        //только окраска в серый цвет, без проверки, только для ДКБ
        let brand = src.match(/^\W*<br>+(.+?)\s\[/)
        //mark(brand[1], 'rgba(37, 37, 37, 0.58)')
        mark(brand[1], '#fff', '25', '#000')
        //mark(`(${numberCar[1]})`, 'rgba(37, 37, 37, 0.58)')
        mark(`(${numberCar[1]})`, '#fff', '25', '#000')
    } else {
        //проверка на подлиность госномера, без окрашивания в серый цвет, только ДКК
        if (!cities.includes(params.city)) {
            if (/^\W\W/.test(numberCar[1])) {
                regions.indexOf(numberCar[1].match(/\d{0,2}$/)[0]) >= 0 ? mark(`(${numberCar[1]})`, 'transparent') : mark(`(${numberCar[1]})`, 'red')
            } else {
                regions.indexOf(numberCar[1].match(/\d{0,3}$/)[0]) >= 0 ? mark(`(${numberCar[1]})`, 'transparent') : mark(`(${numberCar[1]})`, 'red')
            }
        }
    }

    switch (color[1]) {
        case 'Белый': mark(color[1], '#ffffff')
            break
        case 'Черный': mark(color[1], '#000')
            break
        case 'Красный': mark(color[1], '#f00')
            break
        case 'Зеленый': mark(color[1], '#09a90e')
            break
        case 'Желтый': mark(color[1], '#ffe000')
            break
        case 'Темно-синий': mark(color[1], '#042da0')
            break
        case 'Синий': mark(color[1], '#214be4')
            break
        case 'Голубой': mark(color[1], '#4abcff')
            break
        case 'Оранжевый': mark(color[1], '#ff9900')
            break
        case 'Бежевый': mark(color[1], '#fff5d6')
            break
        case 'Серый': mark(color[1], '#797979')
            break
        case 'Фиолетовый': mark(color[1], '#8e07b1')
            break
        case 'Коричневый': mark(color[1], '#753d2c')
            break
    }
};

if (url.includes('/dkk') || url.includes('qc?exam=branding')) {
    $(document).bind('item_info', setColor)
}

function markSLA(e, params) {
    if (document.querySelector('tr[data-status="0"]') === null) return []
    if (document.getElementById('pool-order').value === 'descending') return []

    const table = document.querySelector('tr[data-status="0"]').querySelector('.content').textContent.split(' ')

    const getTimes = (date, time) => new Date(date.split('-')[0], date.split('-')[1]-1, date.split('-')[2], time.split(':')[0], time.split(':')[1], time.split(':')[2])

    const getDay = str => {
        let dates = str.split('.'),
            now = new Date().toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' }).split('.')
        return str.includes('Сегодня') ? `${now[2]}-${now[1]}-${now[0]}` : `20${dates[2]}-${dates[1]}-${dates[0]}`
    }

    const nowDate = () => {
        let day = new Date().toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' }).split('.'),
            time = new Date().toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow' }).split(':')
        return [+day[2], +day[1]-1, +day[0], +time[0], +time[1], +time[2]]
    }

    const nowMSK = new Date(nowDate()[0], nowDate()[1], nowDate()[2], nowDate()[3], nowDate()[4], nowDate()[5])

    // console.log(`дней: ${Math.floor((nowMSK - getTimes(getDay(table[0]), table[1]) % 31536000000) / 86400000 / 3600000)}, часов: ${Math.floor((nowMSK - getTimes(getDay(table[0]), table[1]) % 31536000000) % 86400000 / 3600000)}, минут: ${Math.floor((nowMSK - getTimes(getDay(table[0]), table[1]) % 31536000000) % 86400000 % 3600000 / 60000)}, секунд: ${Math.floor((nowMSK - getTimes(getDay(table[0]), table[1]) % 31536000000) % 86400000 % 3600000 % 60000 / 1000)}`);

    let day = Math.floor(Math.floor(nowMSK - getTimes(getDay(table[0]), table[1])) / 86400000),
        hour = Math.floor((nowMSK - getTimes(getDay(table[0]), table[1]) % 31536000000) % 86400000 / 3600000),
        min = Math.floor((nowMSK - getTimes(getDay(table[0]), table[1]) % 31536000000) % 86400000 % 3600000 / 60000),
        sec = Math.floor((nowMSK - getTimes(getDay(table[0]), table[1]) % 31536000000) % 86400000 % 3600000 % 60000 / 1000)

    // console.log(`${day} ${declOfNum(day, ['день', 'дня', 'дней'])}, ${hour} ${declOfNum(hour, ['час', 'часа', 'часов'])}, ${min} ${declOfNum(min, ['минута', 'минуты', 'минут'])}, ${sec} ${declOfNum(sec, ['секунда', 'секунды', 'секунд'])}`)

    //return `${day} ${declOfNum(day, ['день', 'дня', 'дней'])}, ${hour} ${declOfNum(hour, ['час', 'часа', 'часов'])}, ${min} ${declOfNum(min, ['минута', 'минуты', 'минут'])}, ${sec} ${declOfNum(sec, ['секунда', 'секунды', 'секунд'])}`
    return [day, hour, min, sec]
}

function declOfNum(number, titles) {
    let cases = [2, 0, 1, 1, 1, 2]
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
}

function toHTML(arr){
    if (arr.length < 1) return `нет анкет`
    if (arr.length < 1) return `установи "сначала старые"`
    const [day, hour, min, sec]=arr
    return `${day} ${declOfNum(day, ['день', 'дня', 'дней'])}, ${hour} ${declOfNum(hour, ['час', 'часа', 'часов'])}, ${min} ${declOfNum(min, ['минута', 'минуты', 'минут'])}, ${sec} ${declOfNum(sec, ['секунда', 'секунды', 'секунд'])}`
    //return `${day} ${declOfNum(day, ['день', 'дня', 'дней'])}, ${hour} ${declOfNum(hour, ['час', 'часа', 'часов'])}, ${min} ${declOfNum(min, ['минута', 'минуты', 'минут'])}`
}

const dkkInfo = {
    dkk1: {
        level: {
            day: 0,
            hour: 4,
            min: 0,
        },
        calling: {
            day: 0,
            hour: 4,
            min: 0,
        },
        blacklist: {
            day: 0,
            hour: 0,
            min: 15,
        },
    },
    dkk1T: {
        blacklist: {
            day: 0,
            hour: 8,
            min: 0,
        },
    },
    dkkT: {
        blacklist: {
            day: 0,
            hour: 0,
            min: 15,
        },
    },
    dkk: {
        level: {
            day: 0,
            hour: 8,
            min: 0,
        },
        calling: {
            day: 0,
            hour: 24,
            min: 0,
        },
        blacklist: {
            day: 0,
            hour: 0,
            min: 15,
        },
    }
}

const tree = document.querySelector('.vspan0'),
      mark = document.createElement('div')

tree.before(mark)
const style = document.createElement('style')
style.innerHTML = `
@keyframes sla {
0% { transfrom: scale(1) }
50% { transform: scale(0.9) }
100% { transform: scale(1) }
}`
document.querySelector('head').append(style)

//mark.style = `color: #fff; background-color: #d9534f; padding: 0 10px; border-radius: 4px; margin-bottom: 10px;`
const markStyle = `color: #fff; padding: 0 10px; border-radius: 4px; margin-bottom: 10px; background-color: #d9534f; cursor: pointer;`
mark.style = markStyle

mark.addEventListener('click', async function(){
    const g = document.getElementById('category').selectedOptions[0]
    const t = markSLA()

    let res = g.textContent
    let tr = 'ДКК'


    if (url.includes('priority')){
        tr = 'ДКК1'
    }

    if (url.includes('branding')){
        tr = 'Брендинг'
    }

    if (url.includes('chair')){
        tr = 'Кресла'
    }

    if (url.includes('booster')){
        tr = 'Бустеры'
    }


    if (g.value === 'DkkTariffsBlock' || g.value === 'DkkPriorityTariffsBlock'){
        res = `Тариф ${g.textContent}`
    }

    if(t.length<1) {
        return await navigator.clipboard.writeText(`${tr} ${res} 0h0m\n`)
    }

    if (t[0]>0){
        return await navigator.clipboard.writeText(`${tr} ${res} ${t[0]}d${t[1]}h${t[2]}m\n`)
    }

    if(t[2]<1){
        return await navigator.clipboard.writeText(`${tr} ${res} <${t[1]}h1m\n`)
    }

    return await navigator.clipboard.writeText(`${tr} ${res} ${t[1]}h${t[2]}m\n`)
})

function updateData(sla=[], info={}){
    if (sla.length < 1) return `${markStyle} background-color: grey`;
    const [daySla, hourSla, minSla] = sla
    const totalSla = (daySla*24*60)+(hourSla* 60) + minSla
    //const totalSla = 1440
    const {day, hour, min} = info
    const total = (day*24*60)+(hour* 60) + min

    //30%
    const green = { minimum: 0, maximum: total-Math.floor((total/100)*30) }
    //30% 15%
    const yellow = { minimum: total-Math.floor((total/100)*30), maximum: total-Math.floor((total/100)*15) }
    //15%
    const red = { minimum: total-Math.floor((total/100)*15), maximum: total }

    //console.log(totalSla)
    //console.log(total)
    //console.log(green)
    //console.log(yellow)
    //console.log(red)

    if (totalSla <= green.maximum){
        //console.log('green')
        return `${markStyle} background-color: green;`
    }

    if (totalSla > yellow.minimum && totalSla <= yellow.maximum){
        //console.log('yellow')
        return `${markStyle} background-color: orange;`
    }

    if (totalSla > red.minimum && totalSla < red.maximum){
        //console.log('red')
        return `${markStyle} background-color: #d9534f;`
    }

    if (totalSla >= red.maximum){
        //console.log('red ping')
        return `${markStyle} background-color: #d9534f; transform: scale(1); animation: 2s infinite sla;`
    }
}
function controllerQuery(url, query){
    if (url.includes('priority')){
        switch (query){
                //dkk1
            case 'DkkPriorityInvite' : return updateData(markSLA(), dkkInfo.dkk1.calling)
            case 'DkkPriorityBlock' : return updateData(markSLA(), dkkInfo.dkk1.blacklist)
            case 'DkkPriorityTariffsBlock' : return updateData(markSLA(), dkkInfo.dkk1T.blacklist)
            default: return updateData(markSLA(), dkkInfo.dkk1.level)
        }
    }
    if (!url.includes('priority')){
        //console.log('dkk')
        switch (query){
                //dkk
            case 'DkkCommonInvite' : return updateData(markSLA(), dkkInfo.dkk.calling)
            case 'DkkCommonBlock' : return updateData(markSLA(), dkkInfo.dkk.blacklist)
            case 'DkkTariffsBlock' : return updateData(markSLA(), dkkInfo.dkkT.blacklist)
            default: return updateData(markSLA(), dkkInfo.dkk.level)
        }
    }
}

/*const tree = document.querySelector('.vspan0'),
      mark = document.createElement('div')

tree.before(mark)
mark.style = `color: #fff; background-color: #d9534f; padding: 0 10px; border-radius: 4px; margin-bottom: 10px;`*/
//if (!url.includes('branding')){
const timerStart = () => setTimeout(() => {
    if (url.includes('dkk')){
        mark.style = controllerQuery(url, document.getElementById('category').selectedOptions[0].value)
        if (url.includes('priority')){
                const count = document.getElementById('category').selectedOptions[0].textContent.match(/\[(\d+)\]/)[1]
                document.querySelector('title').textContent = `${count}@${markSLA().length < 1 ? '0': markSLA()[0]}d/${markSLA().length < 1 ? '0': markSLA()[1]}h/${markSLA().length < 1 ? '0': markSLA()[2]}m`
            }
    }
    mark.innerHTML = `SLA в очереди ${document.getElementById('category').selectedOptions[0].dataset.text}<br>${toHTML(markSLA())}`
}, 1000)

const start = () => {
    timerStart()
    setInterval(() => {
        if (url.includes('dkk')){
            mark.style.backgroundColor = controllerQuery(url, document.getElementById('category').selectedOptions[0].value)
            if (url.includes('priority')){
                const count = document.getElementById('category').selectedOptions[0].textContent.match(/\[(\d+)\]/)[1]
                document.querySelector('title').textContent = `${count}@${markSLA().length < 1 ? '0': markSLA()[0]}d/${markSLA().length < 1 ? '0': markSLA()[1]}h/${markSLA().length < 1 ? '0': markSLA()[2]}m`
            }
        }
        mark.innerHTML = `SLA в очереди ${document.getElementById('category').selectedOptions[0].dataset.text}<br>${toHTML(markSLA())}`
    }, 30 * 1000)
}

start()

document.getElementById('category').addEventListener('change', timerStart)
document.getElementById('pool-order').addEventListener('change', timerStart)
//}