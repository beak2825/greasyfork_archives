// ==UserScript==
// @name         СТС поворот фото
// @version      0.7.8
// @description  ///поворот фото ///скейл фото ///кнопки и скейл в истории ///+контраст ///+горячие клавиши ///+ДКК
// @author       qc
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk/priority
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc?exam=sts
// @include     https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=sts*
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/380397/%D0%A1%D0%A2%D0%A1%20%D0%BF%D0%BE%D0%B2%D0%BE%D1%80%D0%BE%D1%82%20%D1%84%D0%BE%D1%82%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/380397/%D0%A1%D0%A2%D0%A1%20%D0%BF%D0%BE%D0%B2%D0%BE%D1%80%D0%BE%D1%82%20%D1%84%D0%BE%D1%82%D0%BE.meta.js
// ==/UserScript==

let url = document.location.href

if(!url.includes('qc?exam=branding')){

    class CreateRange {
        constructor(min, max, text) {
            const range = document.createElement('input'),
                  div = document.createElement('div')
            div.append(range)
            range.setAttribute('type', 'range')
            range.dataset.name = text
            range.setAttribute('step', '10')
            range.setAttribute('min', min)
            range.setAttribute('value', '100')
            range.setAttribute('max', max)
            range.setAttribute('title', `Размер ${text} 100%`)
            div.style = `padding: 5px; background-color: #fff; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 6px 12px rgba(0,0,0,0.175); display: none;`
            return div
        }
    }

    class Wrapper {
        constructor(text) {
            const wrapper = document.createElement('div')
            wrapper.textContent = `⯆ ${text}`
            wrapper.style = `color: white; background-color: black; padding: 3px 8px; border: 1px solid rgb(128,128,128); border-radius: 3px; margin: 2px; opacity: 0.5; cursor: pointer;`
            return wrapper
        }
    }

    class CreateBtn {
        constructor(text) {
            const button = document.createElement('button')
            button.className = `rotate btn btn-info`
            button.style.marginRight = '5px'
            button.setAttribute('title', `Поворот изображения ${text} градусов`)
            button.textContent = text
            button.value = text
            return button
        }
    }

    class LocalUtils {
        constructor(name) {
            this.name = name
        }

        getLocal() {
            const util = localStorage.getItem(this.name)
            if (util !== null) {
                return JSON.parse(util)
            } else return localStorage.setItem(this.name, JSON.stringify(false))
        }

        saveLocal(boolean) {
            localStorage.setItem(this.name, JSON.stringify(boolean))
        }
    }

    function resetInfo() {
        const checkThumbNumber = document.querySelector('.check-thumb-number'),
              //метки
              tags = document.getElementById('mkk-invite'),
              parentTags = tags.parentNode
        setTimeout(() => {
            const photosSector = document.getElementById('photos')

            photosSector.before(checkThumbNumber)
            checkThumbNumber.style.bottom = '80px'
            //метки
            photosSector.before(parentTags)
            parentTags.style.top = '40px'
            parentTags.style.zIndex = '99999'
        }, 300)
    }

    function scale(el) {
        const content = document.getElementById('content')
        content.style.transform = `rotate(${content.dataset.rotate}deg) scale(${el.value/100})`
        el.setAttribute('title', `Размер изображения ${el.value}%`)
    }

    function rotate(value, el) {
        const content = document.getElementById('content')
        let deg = content.dataset.rotate
        content.style.transform = `rotate(${+deg+(+value)}deg) scale(${el.value/100})`
        content.dataset.rotate = +deg+(+value)
    }

    function bright(el) {
        const content = document.getElementById('content')
        content.style.filter = `brightness(${el.value/100})`
        el.setAttribute('title', `Размер контраст ${el.value}%`)
    }

    function savePhoto() {
        const content = document.getElementById('content')
        let link = content.style.backgroundImage.slice(4, -1).replace(/"/g, "")
        window.open(link, '_blank')
    }

    function vinSts() {
        const vin = document.getElementById('sts-vin'),
              label = vin.previousElementSibling
        label.style.cursor = 'pointer'
        label.addEventListener('dblclick', () => vin.value = '00000000000000000')
    }

    function wheel(event, el) {
        if (event.deltaY < 0) {
            el.value = el.value - 10
            scale(el)
        } else {
            el.value = el.value - (-10)
            scale(el)
        }
    }

    function wheelBright(event, el) {
        if (event.deltaY < 0) {
            el.value = el.value - 10
            bright(el)
        } else {
            el.value = el.value - (-10)
            bright(el)
        }
    }

    //function main() {
        const rangeScale = new CreateRange('50', '250', 'Изображения'),
              wrapScale = new Wrapper('Лупа'),
              rangeBright = new CreateRange('80', '200', 'Контраст'),
              wrapBright = new Wrapper('Контраст'),
              wrapSavePhoto = new Wrapper('Сохранить фото'),
              content = document.getElementById('content'),
              photos = document.getElementById('photos'),
              div = document.createElement('div')
        div.style = `position: absolute; top: 40px; right: 0; min-width: 180px`
        //Scale
        photos.before(div)
        div.append(wrapScale)
        div.append(rangeScale)
        //Bright
        div.append(wrapBright)
        div.append(rangeBright)
        //Save Photo
        url.includes('qc?exam=sts') ? div.append(wrapSavePhoto) : ''
        url.includes('qc?exam=sts') ? vinSts() : ''
        url.includes('history?exam=') ? div.append(wrapSavePhoto) : ''

        resetInfo()

        const localScale = new LocalUtils('localScale'),
              localBright = new LocalUtils('localBright')

        localScale.getLocal() ? rangeScale.style.display ='block' : rangeScale.style.display ='none'
        localBright.getLocal() ? rangeBright.style.display ='block' : rangeBright.style.display ='none'

        function open(el) {
            if (el.style.display === 'none') {
                el.style.display = 'block'
                switch (el.firstChild.dataset.name) {
                    case 'Изображения': localScale.saveLocal(true)
                        break
                    case 'Контраст': localBright.saveLocal(true)
                        break
                }
            } else {
                el.style.display = 'none'
                switch (el.firstChild.dataset.name) {
                    case 'Изображения': localScale.saveLocal(false)
                        break
                    case 'Контраст': localBright.saveLocal(false)
                        break
                }
            }
        }

        if (url.includes('history?exam=')) {
            const user = document.getElementById('user'),
                  parent = user.closest('.container-filters'),
                  divBtn = document.createElement('div'),
                  btnUnder90deg = new CreateBtn('-90'),
                  btn180deg = new CreateBtn('180'),
                  btn90deg = new CreateBtn('90')
            parent.style.zIndex = '99999'
            parent.append(divBtn)
            divBtn.style = `position: absolute; top: 0; right: 0;`
            divBtn.append(btnUnder90deg)
            divBtn.append(btn180deg)
            divBtn.append(btn90deg)
        } else {
            const pullRight = document.querySelector('.pull-right'),
                  containerFilters = pullRight.closest('.container-filters')
            containerFilters.style.zIndex = '99999'
        }


        function resetContent() {
            const content = document.getElementById('content')
            content.style.transform = `rotate(0deg) scale(1.0)`
            content.style.filter = `brightness(1)`
            rangeScale.firstChild.value = '100'
            rangeBright.firstChild.value = '100'
            rangeScale.firstChild.setAttribute('title', `Размер изображения 100%`)
            rangeBright.firstChild.setAttribute('title', `Размер контраст 100%`)
            content.dataset.rotate = 0
        }

        $(document).bind("select_item", function (e, params) {
            resetContent()
        })
        
        //if (!url.includes('qc?exam=identity')) {
         $(document).bind("content", function (e, params) {
             resetContent()
         })
        //}

        $('.rotate.btn.btn-info').each(function(){$(this).unbind('click')});
        
        if (url.includes('qc?exam=sts')) {
            let allRotateBtn = document.querySelectorAll('.rotate')
            $(document).bind("content", function (e, params) {
                if (params.rotate === false) {
                allRotateBtn.forEach((btn) => {
                    btn.disabled = false
                    //content.dataset.rotate = 0
                })
                //resetContent()
                }
            })
        }

        if (url.includes('qc?exam=identity')) {
            $("body").unbind('keydown')
            //$("#search").unbind('keydown') //поиск в истории
            //$("#search-id").unbind('keydown') //поиск по ид
            //$("#search-q").unbind('keydown') //поиск
        }

        rangeScale.addEventListener('change', () => scale(rangeScale.firstChild))
        rangeBright.addEventListener('change', () => bright(rangeBright.firstChild))
        document.querySelector('.btn-info[value="-90"]').addEventListener('click', () => rotate('-90', rangeScale.firstChild))
        document.querySelector('.btn-info[value="180"]').addEventListener('click', () => rotate('180', rangeScale.firstChild))
        document.querySelector('.btn-info[value="90"]').addEventListener('click', () => rotate('90', rangeScale.firstChild))
        wrapScale.addEventListener('click', () => open(rangeScale))
        wrapBright.addEventListener('click', () => open(rangeBright))
        wrapSavePhoto.addEventListener('click', () => savePhoto())
        content.addEventListener('wheel', (event) => {
            if (isShift) {
                event.deltaY < 0 ? rotate('-90', rangeScale.firstChild) : rotate('90', rangeScale.firstChild)
            } else wheel(event, rangeScale.firstChild)
        })

        let isShift,
            isCtrl

        let photoAll

        $(document).bind("select_item", function (e, params) {
            photoAll = document.querySelectorAll('.check-thumb-view-dkk')
            //console.log(photoAll)
        })

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Shift') isShift = true
            if (event.key === 'Control') isCtrl = true
            //if (url.includes('qc?exam=identity')) {
                if (isShift) {
                    switch (event.key) {
                      /*case 'ArrowRight': rotate('90', rangeScale.firstChild)
                            break
                        case 'ArrowLeft': rotate('-90', rangeScale.firstChild)
                            break*/
                        case 'ArrowDown': rotate('-90', rangeScale.firstChild)
                            break
                        case 'ArrowUp': rotate('90', rangeScale.firstChild)
                            break
                    }
                }
                if (isCtrl) {
                    if (url.includes('qc?exam=identity')) {
                        switch (event.key) {
                            case 'ArrowRight': {
                                let urls = [],
                                    url = content.style.backgroundImage
                                photoAll.forEach(item => {
                                    urls.push(item.style.backgroundImage)
                                })
                                content.style.backgroundImage = urls[urls.indexOf(url)+1]
                                break
                            }
                            case 'ArrowLeft': {
                                let urls = [],
                                    url = content.style.backgroundImage
                                photoAll.forEach(item => {
                                    urls.push(item.style.backgroundImage)
                                })
                                content.style.backgroundImage = urls[urls.indexOf(url)-1]
                                break
                            }
                        }
                    }
                    switch (event.key) {
                        case 'ArrowDown': {
                            rangeBright.firstChild.value = rangeBright.firstChild.value - (-10)
                            bright(rangeBright.firstChild)
                            break
                        }
                        case 'ArrowUp':{
                            rangeBright.firstChild.value = rangeBright.firstChild.value - 10
                            bright(rangeBright.firstChild)
                            break
                        }
                    }
                }
            //}
        })
        document.addEventListener('keyup', (event) => {
            if (event.key === 'Shift') isShift = false
            if (event.key === 'Control') isCtrl = false
        })
    //отключение функции майн
    //}
    //main()
}
