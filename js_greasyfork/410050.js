// ==UserScript==
// @name         Временный скрипт ДКП формат фото
// @description ...
// @version      0.0.1
// @author       qc
// @match        https://taximeter-admin.taxi.yandex-team.ru/qc?exam=identity
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/410050/%D0%92%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%94%D0%9A%D0%9F%20%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%20%D1%84%D0%BE%D1%82%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/410050/%D0%92%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%94%D0%9A%D0%9F%20%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%20%D1%84%D0%BE%D1%82%D0%BE.meta.js
// ==/UserScript==

const divFormat = document.createElement('div'),
          info = document.getElementById('info')

    info.after(divFormat)
    divFormat.style.float = 'right'
    //divFormat.textContent = 'Формат 16:9'

    function renderFormat(w,h){
        console.log(w)
        console.log(h)

        let iW, iH,
            minMax = Math.max(w, h)

        /*if (minMax % 16 === 0) {*/
            iW = w/(minMax/16)
            iH = h/(minMax/16)
        /*} else {
            if (minMax % 4 ===0) {
                iW = w/(minMax/4)
                iH = h/(minMax/4)
            /*}
        }*/


        /*if (minMax === w) {
            if ((minMax/16)*9 === h) {

            }
        }*/

        return `Формат ${iW % 1 === 0 ? iW : iW.toFixed(3)}:${iH % 1 === 0 ? iH : iH.toFixed(3)}`
    }

    let photoItems
    const image = new Image()
    $(document).bind("content", function (e, params) {
        console.log('content',params)
        console.log('e',e)
        photoItems = params.items
        //let {IdentityRegistration, IdentitySelfie, IdentityTitle} = params.items
        //console.log(IdentityRegistration)
        //console.log('URL',photoItems[params.index])
        image.src = photoItems[params.index]
        //let image = new Image()
        //image.src = params[params.index]
        //console.log(image)
        /*let imageWidth = image.width,
            imageHeight = image.height,
            minMax = Math.max(imageWidth, imageHeight)*/

        //console.log('width', image.width)
        //console.log('height', image.height)


        divFormat.textContent = renderFormat(image.width, image.height)
        /*setTimeout(() => {
            console.log('width', image.width)
            console.log('height', image.height)
        }, 500)*/
    })
    /*$(document).bind("item_info", function (e, params) {
        console.log(photoItems)
        let {IdentityRegistration, IdentitySelfie, IdentityTitle} = photoItems
        console.log(IdentityRegistration)
        let image = new Image()
        image.src = IdentityRegistration
        console.log(image)
        console.log('width',image.width)
        console.log('height', image.height)
    })*/