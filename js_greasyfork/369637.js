// ==UserScript==
// @name         Поиск в/у в базе ГИБДД
// @version      0.4.4
// @description  ///+проверка Латвии для ДКК, СТС, ДКВУ
// @author       Gusev
// @grant        none
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk/priority
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/369637/%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%20%D0%B2%D1%83%20%D0%B2%20%D0%B1%D0%B0%D0%B7%D0%B5%20%D0%93%D0%98%D0%91%D0%94%D0%94.user.js
// @updateURL https://update.greasyfork.org/scripts/369637/%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%20%D0%B2%D1%83%20%D0%B2%20%D0%B1%D0%B0%D0%B7%D0%B5%20%D0%93%D0%98%D0%91%D0%94%D0%94.meta.js
// ==/UserScript==

let parent = document.querySelector('.nav-tabs'),
    li = document.createElement('li'),
    button = document.createElement('a')

button.textContent = '🛠️'
button.style.borderRadius = '4px'
button.style.backgroundColor = '#267fb1'
button.style.color = '#fff'
button.style.cursor = 'pointer'
li.appendChild(button)
parent.appendChild(li)

let url = document.location.href

url.includes('qc?exam=dkvu') ? button.onclick = checkLicenseDkvu : button.onclick = checkLicenseDkk

function checkLicenseDkvu(){
    let src = document.getElementById('info').innerHTML
    if (src.includes('Рига') || src.includes('Даугавпилс') || src.includes('Лиепая') || src.includes('Валмиера') || src.includes('Вентспился') || src.includes('Елгава')) {
        let license = document.getElementById('dkvu-middle-name').value.trim(),
            //http://www.atd.lv/ru/taxi?fname=&lname=&regnr=TV-03160&op=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA&form_build_id=form-zg3bEJEJVstzQVEyC7eBCo0dQw8_q0O6d6UGVJqJFnM&form_id=atd_taxi_form
            //http://www.atd.lv/ru/taxi/TV-03160
            linkLat = `http://www.atd.lv/ru/taxi/${license}`
            //linkLat = `http://www.atd.lv/ru/taxi?fname=&lname=&regnr=${license}`

        window.open(linkLat, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=10,left=300,width=800,height=1000")
    } else {
        let number = document.querySelector('#dkvu-license-number').value,
            date = document.querySelector('#dkvu-license-issue-date').value.split('-').reverse().join('.'),
            link = "https://гибдд.рф/check/driver#" + number + '+' + date;

        window.open(link, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=10,left=300,width=300,height=1000")
    }
}

function checkLicenseDkk() {
    let src = document.getElementById('info').textContent
    if (src.includes('Рига') || src.includes('Даугавпилс') || src.includes('Лиепая') || src.includes('Валмиера') || src.includes('Вентспился') || src.includes('Елгава')) {
        let patternLat = /\([\s\S]*\)/,
            numberLat = src.match(patternLat).join().toUpperCase()
        if (numberLat.includes('TX') || numberLat.includes('TQ') || numberLat.includes('EX')) {
            alert(`Проверке подлежат госномера на белом фоне(кроме TX*, TQ*, EX*)`)
        } else {
            let number = numberLat.slice(numberLat.indexOf('(')+1, numberLat.indexOf(')')),
                linkLat = `http://www.atd.lv/ru/licences?fname=&lname=&doknr=${number}`
            //http://www.atd.lv/ru/licences
            //edit-doknr
            //http://www.atd.lv/ru/licences?fname=&lname=&doknr=${number}
            window.open(linkLat, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=10,left=300,width=1000,height=800")
            console.log(number)
        }
    } else {
        alert(`Только для Латвии`)
    }
}