// ==UserScript==
// @name         Разметка цвета (+15цветов)
// @version      0.3.8
// @description  ///+СТС очередь ///+ДКК очередь ///+несбрасывание очереди //+Брендинг
// @author       Yandex
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc?exam=dkvu
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc?exam=sts
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk/priority
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc?exam=branding
// @grant        none
// @namespace https://greasyfork.org/users/395826
// @downloadURL https://update.greasyfork.org/scripts/435272/%D0%A0%D0%B0%D0%B7%D0%BC%D0%B5%D1%82%D0%BA%D0%B0%20%D1%86%D0%B2%D0%B5%D1%82%D0%B0%20%28%2B15%D1%86%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/435272/%D0%A0%D0%B0%D0%B7%D0%BC%D0%B5%D1%82%D0%BA%D0%B0%20%D1%86%D0%B2%D0%B5%D1%82%D0%B0%20%28%2B15%D1%86%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%29.meta.js
// ==/UserScript==

let url = document.location.href

url.includes('qc?exam=dkvu') ? dkvuLine() : ''
url.includes('qc?exam=sts') ? stsLine() : ''
url.includes('/dkk') ? dkkLine() : ''
url.includes('branding') ? dkvuLine() : ''

function staticLine() {

    const categoryLine = document.getElementById('category')

    const setLine = (val) => {
        categoryLine.value = val
        setTimeout(() => {
            window.update();
        }, 350)
        saveLine()
    }

    const saveLine = () => localStorage.setItem('localLine', JSON.stringify(categoryLine.value))
    //!localStorage.getItem('localLine') ? localStorage.setItem('localLine', JSON.stringify(categoryLine.value)) : localStorage.setItem('localLine', JSON.stringify(categoryLine.value))

    if (localStorage.getItem('localLine')) {
        let value = JSON.parse(localStorage.getItem('localLine'))
        setLine(value)
    }
    //} else {
    //    localStorage.setItem('localLine', JSON.stringify(categoryLine.value))
    //}

    categoryLine.addEventListener('change', () => saveLine())
}

function dkvuLine() {
    function refreshMarking() {

    const dataGridContent = document.querySelector('.datagrid-content');
    const arrColor = {
        top: '4', //#e6399b топ
        two: '10', //#00ffff бирюза
        three: '17', //#ff5640
        four: '24', //#effd49
        five: '31', //#ff7f50
        six: '38', //#9b30ff
        seven: '45', //#35d699
        eight: '52', //#f6b26b
        nine: '59', //#4813f2
        ten: '66', //#f7d6b4
        eleven: '73', //#e262fa
        twelve: '80', //#b0c4de
        thirteen: '87', //#18ff26
        fourteen: '94', //#ff80d2
        fifteen: '100', //#8498ff
        sixteen: '100', //#6b8e23
        white: '100', //#ffff
    }
    dataGridContent.style = 'background: green none repeat scroll 0% 0%;';
    dataGridContent.style = `background: -webkit-gradient(linear, left top, left bottom,
color-stop(${arrColor.top}%, #e6399b), color-stop(${arrColor.top}%, #e6399b),
color-stop(${arrColor.top}%, #00ffff), color-stop(${arrColor.two}%, #00ffff), color-stop(${arrColor.two}%, #00ffff),
color-stop(${arrColor.two}%, #ff5640), color-stop(${arrColor.three}%, #ff5640), color-stop(${arrColor.three}%, #ff5640),
color-stop(${arrColor.three}%, #effd49), color-stop(${arrColor.four}%, #effd49), color-stop(${arrColor.four}%, #effd49),
color-stop(${arrColor.four}%, #ff7f50), color-stop(${arrColor.five}%, #ff7f50), color-stop(${arrColor.five}%, #ff7f50),
color-stop(${arrColor.five}%, #9b30ff), color-stop(${arrColor.six}%, #9b30ff), color-stop(${arrColor.six}%, #9b30ff),
color-stop(${arrColor.six}%, #35d699), color-stop(${arrColor.seven}%, #35d699), color-stop(${arrColor.seven}%, #35d699),
color-stop(${arrColor.seven}%, #f6b26b), color-stop(${arrColor.eight}%, #f6b26b), color-stop(${arrColor.eight}%, #f6b26b),
color-stop(${arrColor.eight}%, #4813f2), color-stop(${arrColor.nine}%, #4813f2), color-stop(${arrColor.nine}%, #4813f2),
color-stop(${arrColor.nine}%, #f7d6b4), color-stop(${arrColor.ten}%, #f7d6b4), color-stop(${arrColor.ten}%, #f7d6b4),
color-stop(${arrColor.ten}%, #e262fa), color-stop(${arrColor.eleven}%, #e262fa), color-stop(${arrColor.eleven}%, #e262fa),
color-stop(${arrColor.eleven}%, #b0c4de), color-stop(${arrColor.twelve}%, #b0c4de), color-stop(${arrColor.twelve}%, #b0c4de),
color-stop(${arrColor.twelve}%, #18ff26), color-stop(${arrColor.thirteen}%, #18ff26), color-stop(${arrColor.thirteen}%, #18ff26),
color-stop(${arrColor.thirteen}%, #ff80d2), color-stop(${arrColor.fourteen}%, #ff80d2), color-stop(${arrColor.fourteen}%, #ff80d2),
color-stop(${arrColor.fourteen}%, #8498ff), color-stop(${arrColor.fifteen}%, #8498ff), color-stop(${arrColor.fifteen}%, #8498ff),
color-stop(${arrColor.fifteen}%, #6b8e23), color-stop(${arrColor.sixteen}%, #6b8e23), color-stop(${arrColor.sixteen}%, #6b8e23),
color-stop(${arrColor.sixteen}%, #ffff), color-stop(${arrColor.white}%, #fff), color-stop(${arrColor.white}%, #fff), color-stop(${arrColor.white}%, #fff)
)`
}

    setTimeout(refreshMarking, 350)
    staticLine()
    console.log('Загружена подсветка очереди ДКВУ/Брендинг')
}

function stsLine() {
    function refreshMarking() {

        const dataGridContent = document.querySelector('.datagrid-content');
        dataGridContent.style = 'background: green none repeat scroll 0% 0%;';
        dataGridContent.style = 'background: -webkit-gradient(linear, left top, left bottom, color-stop(6.25%, #e6399b), color-stop(6.25%, #e6399b), color-stop(6.25%, #00ffff), color-stop(12.5%, #00ffff), color-stop(12.5%, #00ffff), color-stop(12.5%, #ff5640), color-stop(18.75%, #ff5640), color-stop(18.75%, #ff5640), color-stop(18.75%, #effd49), color-stop(25%, #effd49), color-stop(25%, #effd49), color-stop(25%, #ff7f50), color-stop(31.25%, #ff7f50), color-stop(31.25%, #ff7f50), color-stop(31.25%, #9b30ff), color-stop(37.5%, #9b30ff), color-stop(37.5%, #9b30ff), color-stop(37.5%, #35d699), color-stop(43.75%, #35d699), color-stop(43.75%, #35d699), color-stop(43.75%, #f6b26b), color-stop(50%, #f6b26b), color-stop(50%, #f6b26b), color-stop(50%, #4813f2), color-stop(56.25%, #4813f2), color-stop(56.25%, #4813f2), color-stop(56.25%, #f7d6b4), color-stop(62.5%, #f7d6b4), color-stop(62.5%, #f7d6b4), color-stop(62.5%, #e262fa), color-stop(68.75%, #e262fa), color-stop(68.75%, #e262fa), color-stop(68.75%, #b0c4de), color-stop(75%, #b0c4de), color-stop(75%, #b0c4de), color-stop(75%, #18ff26), color-stop(81.25%, #18ff26), color-stop(81.25%, #18ff26), color-stop(81.25%, #ff80d2), color-stop(87.5%, #ff80d2), color-stop(87.5%, #ff80d2), color-stop(87.5%, #8498ff), color-stop(93.75%, #8498ff), color-stop(93.75%, #8498ff), color-stop(93.75%, #6b8e23), color-stop(100%, #6b8e23), color-stop(100%, #6b8e23), color-stop(100%, #6b8e23));';
    }
    setTimeout(refreshMarking, 350);
    console.log('Загружена подсветка очереди СТС')
}

function dkkLine() {
    function refreshMarking() {

        const dataGridContent = document.querySelector('.datagrid-content');
        const arrColor = {
            top: '8.25', //#F6B26B топ
            two: '16.5', //#FF5640 оранж
            three: '24.75', //#00FFFF бир
            four: '33', //#E6399B роз
            five: '41.25', //#ff7f50 светло-оранж
            six: '49.5', //#9b30ff фиолет
            seven: '58', //#35d699 зелен
            eight: '66.5', //#CCCCCC серый
            nine: '75', //#9FC5E8 светло-голубой
            ten: '83.25', //#93C47D светло-зеленый
            eleven: '91.5',//#F1C232 желтый
            twelve: '100', //#841600 кирпичный
        }

        dataGridContent.style = 'background: green none repeat scroll 0% 0%;';
        dataGridContent.style = `background: -webkit-gradient(linear, left top, left bottom,
color-stop(${arrColor.top}%, #F6B26B), color-stop(${arrColor.top}%, #F6B26B),
color-stop(${arrColor.top}%, #FF5640), color-stop(${arrColor.two}%, #FF5640), color-stop(${arrColor.two}%, #FF5640),
color-stop(${arrColor.two}%, #01CCCC), color-stop(${arrColor.three}%, #00FFFF), color-stop(${arrColor.three}%, #00FFFF),
color-stop(${arrColor.three}%, #E6399B), color-stop(${arrColor.four}%, #E6399B), color-stop(${arrColor.four}%, #E6399B),
color-stop(${arrColor.four}%, #ff7f50), color-stop(${arrColor.five}%, #ff7f50), color-stop(${arrColor.five}%, #ff7f50),
color-stop(${arrColor.five}%, #9b30ff), color-stop(${arrColor.six}%, #9b30ff), color-stop(${arrColor.six}%, #9b30ff),
color-stop(${arrColor.six}%, #35d699), color-stop(${arrColor.seven}%, #35d699), color-stop(${arrColor.seven}%, #35d699),
color-stop(${arrColor.seven}%, #CCCCCC), color-stop(${arrColor.eight}%, #CCCCCC), color-stop(${arrColor.eight}%, #CCCCCC),
color-stop(${arrColor.eight}%, #9FC5E8), color-stop(${arrColor.nine}%, #9FC5E8), color-stop(${arrColor.nine}%, #9FC5E8),
color-stop(${arrColor.nine}%, #93C47D), color-stop(${arrColor.ten}%, #93C47D), color-stop(${arrColor.ten}%, #93C47D),
color-stop(${arrColor.ten}%, #F1C232), color-stop(${arrColor.eleven}%, #F1C232), color-stop(${arrColor.eleven}%, #F1C232),
color-stop(${arrColor.eleven}%, #841600), color-stop(${arrColor.twelve}%, #841600), color-stop(${arrColor.twelve}%, #841600)
)`
    }

    setTimeout(refreshMarking, 350)
    //staticLine()
    console.log('Загружена подсветка очереди ДКК')
}