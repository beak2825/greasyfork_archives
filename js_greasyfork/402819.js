// ==UserScript==
// @name         Временный  скрипт для теста
// @description  ....
// @version      0.2.5
// @author       qc
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc?exam=identity
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc?exam=sts
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc?exam=dkvu
// @include     https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=*
// @grant        none
// @namespace https://greasyfork.org/users/395826
// @downloadURL https://update.greasyfork.org/scripts/402819/%D0%92%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%20%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D1%81%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/402819/%D0%92%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%20%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D1%81%D1%82%D0%B0.meta.js
// ==/UserScript==

let url = document.location.href,
//настройки для быстрых клавиш
    isShift,
    isCtrl,
    photoAll = []
const content = document.getElementById('content')
//if(!url.includes('qc?exam=branding')){

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
            checkThumbNumber.style.bottom = '130px'
            //метки
            photosSector.before(parentTags)
            parentTags.style.top = '40px'
            parentTags.style.zIndex = '99999'
        }, 300)
    }

    function scale(el, element) {
        //const content = document.getElementById('content')
        element.style.transform = `rotate(${element.dataset.rotate}deg) scale(${el.value/100})`
        el.setAttribute('title', `Размер изображения ${el.value}%`)
    }

    function rotate(value, el, element) {
        //const content = document.getElementById('content')
        let deg = element.dataset.rotate
        element.style.transform = `rotate(${+deg+(+value)}deg) scale(${el.value/100})`
        element.dataset.rotate = +deg+(+value)
    }

    function bright(el, element) {
        //const content = document.getElementById('content')
        element.style.filter = `brightness(${el.value/100})`
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
        label.addEventListener('dblclick', function() {
            vin.value = '00000000000000000'
        })
    }

    function wheel(event, el) {
        if (event.deltaY < 0) {
            el.value = el.value - 10
            scale(el, event.target)
        } else {
            el.value = el.value - (-10)
            scale(el, event.target)
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

    function createModule(element) {
        //btn
        const _module = document.createElement('div'),
              btnUnder90deg = new CreateBtn('-90'),
              btn180deg = new CreateBtn('180'),
              btn90deg = new CreateBtn('90')
        //определение стилей
        _module.style.position = 'absolute'
        _module.style.zIndex = '99999'
        //_module.style.top = '0'
        _module.style.top = url.includes('qc?exam=dkvu') ? '35px' : '0'
        _module.style.right = '0'
        _module.style.width = '180px'
        //divModule.style = `position: absolute; top: 0; right: 0;`
        /*if (url.includes('qc?exam=dkvu')) {
            _module.style.top = '35px'
        }*/
        if (!url.includes('qc?exam=dkvu')) {
            _module.append(btnUnder90deg)
            _module.append(btn180deg)
            _module.append(btn90deg)
        }
        //range
        const rangeScale = new CreateRange('50', '250', 'Изображения'),
              wrapScale = new Wrapper('Лупа'),
              rangeBright = new CreateRange('80', '200', 'Контраст'),
              wrapBright = new Wrapper('Контраст'),
              wrapSavePhoto = new Wrapper('Сохранить фото'),
              divRange = document.createElement('div')
        //div.style = `position: absolute; top: 40px; right: 0; min-width: 180px`
        //Scale
        rangeScale.value = '100'
        rangeScale.setAttribute('title', `Размер изображения 100%`)
        divRange.append(wrapScale)
        divRange.append(rangeScale)
        //Bright
        rangeBright.value = '100'
        rangeBright.setAttribute('title', `Размер контраст 100%`)
        divRange.append(wrapBright)
        divRange.append(rangeBright)
        //Save Photo
        url.includes('qc?exam=sts') ? divRange.append(wrapSavePhoto) : ''
        //сбор в один модуль
        _module.append(divRange)
        //события сохранения открытия блока
        wrapScale.addEventListener('click', () => open(rangeScale))
        wrapBright.addEventListener('click', () => open(rangeBright))
        //события btn
        //if (!url.includes('qc?exam=dkvu')) {
            btnUnder90deg.addEventListener('click', () => rotate('-90', rangeScale.firstChild, element))
            btn180deg.addEventListener('click', () => rotate('180', rangeScale.firstChild, element))
            btn90deg.addEventListener('click', () => rotate('90', rangeScale.firstChild, element))
        //}
        //события range
        rangeScale.addEventListener('change', () => scale(rangeScale.firstChild, element))
        rangeBright.addEventListener('change', () => bright(rangeBright.firstChild, element))
        //события save photo
        wrapSavePhoto.addEventListener('click', () => savePhoto())
        //события на быстрые клавиши
        //клавиши
        document.addEventListener('keydown', (event) => {
            if (isShift) {
                switch (event.key) {
                        //case 'ArrowRight': rotate('90', rangeScale.firstChild)
                        //    break
                        //case 'ArrowLeft': rotate('-90', rangeScale.firstChild)
                        //  break
                    case 'ArrowDown': rotate('-90', rangeScale.firstChild, element)
                        break
                    case 'ArrowUp': rotate('90', rangeScale.firstChild, element)
                        break
                }
            }
            if (isCtrl) {
                switch (event.key) {
                    case 'ArrowDown': {
                        rangeBright.firstChild.value = rangeBright.firstChild.value - (-10)
                        bright(rangeBright.firstChild, element)
                        break
                    }
                    case 'ArrowUp':{
                        rangeBright.firstChild.value = rangeBright.firstChild.value - 10
                        bright(rangeBright.firstChild, element)
                        break
                    }
                }
            }
        })
        //колесико мыши
        element.addEventListener('wheel', (event) => {
            if (isShift) {
                event.deltaY < 0 ? rotate('-90', rangeScale.firstChild, event.target) : rotate('90', rangeScale.firstChild, event.target)
            } else wheel(event, rangeScale.firstChild)
        })
        //save storage
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
        //скидывание интерфейса
        function reset() {
            rangeScale.firstChild.value = '100'
            rangeBright.firstChild.value = '100'
            rangeScale.firstChild.setAttribute('title', `Размер изображения 100%`)
            rangeBright.firstChild.setAttribute('title', `Размер контраст 100%`)
        }
        //общие настройки
        $(document).bind("select_item", () => reset())
        $(document).bind("content", () => reset())
        //возврат модуля
        return _module
    }


    //function main() {
        /*const rangeScale = new CreateRange('50', '250', 'Изображения'),
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
        url.includes('qc?exam=sts') ? vinSts() : ''*/


//общий сброс поля информации
resetInfo()
//общая настройка для отображения на все очереди
function resetContent() {
    const content = document.getElementById('content')
    content.style.transform = `rotate(0deg) scale(1.0)`
    content.style.filter = `brightness(1)`
    content.dataset.rotate = 0
}
resetContent()
//добавление модуля и переопредление Z индекса
if (!url.includes('history?exam=')) {
    const pullRight = document.querySelector('.pull-right'),
          containerFilters = pullRight.closest('.container-filters')

    if (!url.includes('qc?exam=dkvu')) {
        pullRight.innerHTML = ``
    }
    containerFilters.style.zIndex = '99999'
    pullRight.append(createModule(content))
} else {
    const user = document.getElementById('user'),
          parent = user.closest('.container-filters')
    parent.style.zIndex = '99999'
    parent.append(createModule(content))
}
$(document).bind("content", () => resetContent())
$(document).bind("select_item", () => resetContent())


//удаление в очереди паспорта события кликов стрелок
//настройки только для ДКП
if (url.includes('qc?exam=identity')) {
    $("body").unbind('keydown')
    //$("#search").unbind('keydown') //поиск в истории
    //$("#search-id").unbind('keydown') //поиск по ид
    //$("#search-q").unbind('keydown') //поиск

    //заполнение массива фоток для переключения быстрыми клавишами (только для ДКП)
    $(document).bind("select_item", function (e, params) {
        photoAll = []
        photoAll = document.querySelectorAll('.check-thumb-view-dkk')
        //console.log(photoAll)
    })
}
//настройка
document.addEventListener('keydown', (event) => {
    if (event.key === 'Shift') isShift = true
    if (event.key === 'Control') isCtrl = true
    //if (url.includes('qc?exam=identity')) {
    /*if (isShift) {
        switch (event.key) {
                //case 'ArrowRight': rotate('90', rangeScale.firstChild)
                //    break
                //case 'ArrowLeft': rotate('-90', rangeScale.firstChild)
                //  break
            case 'ArrowDown': rotate('-90', rangeScale.firstChild)
                break
            case 'ArrowUp': rotate('90', rangeScale.firstChild)
                break
        }
    }*/
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
        /*switch (event.key) {
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
        }*/
    }
})
//обнуление клавиш шифт и ктрл при отжимании кнопок
document.addEventListener('keyup', (event) => {
    if (event.key === 'Shift') isShift = false
    if (event.key === 'Control') isCtrl = false
})













/*const localScale = new LocalUtils('localScale'),
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
        }*/

        /*if (url.includes('history?exam=')) {
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
        }*/


        /*function resetContent() {
            const content = document.getElementById('content')
            content.style.transform = `rotate(0deg) scale(1.0)`
            content.style.filter = `brightness(1)`
            rangeScale.firstChild.value = '100'
            rangeBright.firstChild.value = '100'
            rangeScale.firstChild.setAttribute('title', `Размер изображения 100%`)
            rangeBright.firstChild.setAttribute('title', `Размер контраст 100%`)
            content.dataset.rotate = 0
        }*/



        //if (!url.includes('qc?exam=identity')) {

        //}
        /*if (!url.includes('qc?exam=dkvu')) {
          $('.rotate.btn.btn-info').each(function(){$(this).unbind('click')});
        }*/

        /*if (url.includes('qc?exam=sts')) {
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
        }*/

        /*if (url.includes('qc?exam=identity')) {
            $("body").unbind('keydown')
            //$("#search").unbind('keydown') //поиск в истории
            //$("#search-id").unbind('keydown') //поиск по ид
            //$("#search-q").unbind('keydown') //поиск
        }*/

        /*rangeScale.addEventListener('change', () => scale(rangeScale.firstChild))
        rangeBright.addEventListener('change', () => bright(rangeBright.firstChild))

        if (!url.includes('qc?exam=dkvu')) {
          document.querySelector('.btn-info[value="-90"]').addEventListener('click', () => rotate('-90', rangeScale.firstChild))
          document.querySelector('.btn-info[value="180"]').addEventListener('click', () => rotate('180', rangeScale.firstChild))
          document.querySelector('.btn-info[value="90"]').addEventListener('click', () => rotate('90', rangeScale.firstChild))
        }

        wrapScale.addEventListener('click', () => open(rangeScale))
        wrapBright.addEventListener('click', () => open(rangeBright))
        wrapSavePhoto.addEventListener('click', () => savePhoto())*/

    //function scaleFunctionTest(event) {
        /*if (isShift) {
            event.deltaY < 0 ? rotate('-90', rangeScale.firstChild) : rotate('90', rangeScale.firstChild)
        } else wheel(event, rangeScale.firstChild)
    }*/
        //content.addEventListener('wheel', (event) => scaleFunctionTest(event))

        /*let isShift,
            isCtrl

        let photoAll*/

        /*$(document).bind("select_item", function (e, params) {
            photoAll = document.querySelectorAll('.check-thumb-view-dkk')
            //console.log(photoAll)
        })*/

        /*document.addEventListener('keydown', (event) => {
            if (event.key === 'Shift') isShift = true
            if (event.key === 'Control') isCtrl = true
            //if (url.includes('qc?exam=identity')) {
                if (isShift) {
                    switch (event.key) {
                      //case 'ArrowRight': rotate('90', rangeScale.firstChild)
                        //    break
                        //case 'ArrowLeft': rotate('-90', rangeScale.firstChild)
                          //  break
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
        })*/
    //отключение функции майн
    //}
    //main()

    //модуль 2 фото для паспорта
    if (url.includes('qc?exam=identity')) {
        class Btn {
            constructor(name) {
                const button = document.createElement('button')
                button.classList.add('btn')
                button.textContent = name

                return button
            }
        }

        class Wrapper {
            constructor(cls) {
                const wrap = document.createElement('div')
                wrap.classList.add(cls)

                return wrap
            }
        }

        class Section extends Wrapper {
            constructor(index) {
                super(index)
                //const div = document.createElement('div')
                //div.append(this)
                this.className = `cover cover-contain`
                this.style.height = `80vh`
                this.style.display = `none`
                this.style.position = `relative`
                this.dataset.index = index
                this.style.transform = `rotate(0deg) scale(1.0)`
                this.style.filter = `brightness(1)`
                this.dataset.rotate = 0
                //return div
            }
        }

        const photos = document.getElementById('photos'),
              identityType = document.getElementById('identity-type'),
              //content = document.getElementById('content'),
              wrapBtn = new Wrapper('container-filters'),
              wrapPhoto = new Wrapper('content-salon'),
              tempWrap1 = new Section('ff'),
              tempWrap2 = new Section('ff'),
              btn = new Btn('2 фото'),
              sectionFront = new Section('Front'),
              sectionBack = new Section('Back')

        wrapBtn.append(btn)
        wrapBtn.style.position = 'absolute'
        wrapBtn.style.bottom = '80px'
        wrapBtn.style.zIndex = '99999'

        photos.before(wrapBtn)

        content.after(wrapPhoto)
        //wrapPhoto.append(sectionFront)
        //wrapPhoto.append(sectionBack)
        wrapPhoto.append(tempWrap1)
        sectionFront.style.width = '100%'
        wrapPhoto.append(tempWrap2)
        sectionBack.style.width = '100%'
        tempWrap1.append(sectionFront)
        tempWrap2.append(sectionBack)
        const moduleFront = createModule(sectionFront),
              moduleBack = createModule(sectionBack)
        moduleFront.style.opacity = '0.3'
        moduleFront.style.display = 'none'
        moduleBack.style.opacity = '0.3'
        moduleBack.style.display = 'none'
        tempWrap1.addEventListener('mouseover', () => {
            moduleFront.style.display = 'block'
            moduleFront.style.display = 'block'
        })
        tempWrap1.addEventListener('mouseout', () => {
            moduleFront.style.display = 'none'
            moduleFront.style.display = 'none'
        })
        tempWrap2.addEventListener('mouseover', () => {
            moduleBack.style.display = 'block'
            moduleBack.style.display = 'block'
        })
        tempWrap2.addEventListener('mouseout', () => {
            moduleBack.style.display = 'none'
            moduleBack.style.display = 'none'
        })
        tempWrap1.append(moduleFront)
        tempWrap2.append(moduleBack)

        $(document).bind("item_info", function (e, params) {
            btn.classList.contains('btn-info') ? setPhoto() : ''
            sectionFront.style.transform = `rotate(0deg) scale(1.0)`
            sectionBack.style.transform = `rotate(0deg) scale(1.0)`
            sectionFront.style.filter = `brightness(1)`
            sectionFront.dataset.rotate = 0
            sectionBack.style.filter = `brightness(1)`
            sectionBack.dataset.rotate = 0
        })

        $(document).bind("content", function (e, params) {
            //btn.classList.remove('btn-info')
            //tempWrap1.style.display = `none`
            //tempWrap2.style.display = `none`
            //sectionFront.style.display = `none`
            //sectionBack.style.display = `none`
        })

        /*content.addEventListener('click', function() {
            console.log(document.getElementById('identity-type').value)
            console.log(identityType.value)
        })*/

        function setPhoto() {
            content.style.display = 'none'
            document.querySelector('.pull-right').style.display = 'none'


            const photoIdentityTitle = document.getElementById('photo-IdentityTitle'),
                  photoIdentitySelfie = document.getElementById('photo-IdentitySelfie'),
                  photoIdentityRegistration = document.getElementById('photo-IdentityRegistration'),
                  photoIdentityFront = document.getElementById('photo-IdentityFront'),
                  photoIdentityBack = document.getElementById('photo-IdentityBack')

            /*switch (identityType.querySelector('option[selected="true"]').value) {
                case 'passport_rus': {
                    sectionFront.style.display = `block`
                    sectionBack.style.display = `block`
                    sectionFront.style.backgroundImage = photoIdentityTitle.style.backgroundImage
                    sectionBack.style.backgroundImage = photoIdentityRegistration.style.backgroundImage
                    break
                }
                case 'passport_kgz': {
                    console.log(1)
                    sectionFront.style.display = `block`
                    sectionBack.style.display = `block`
                    sectionFront.style.backgroundImage = photoIdentityFront.style.backgroundImage
                    sectionBack.style.backgroundImage = photoIdentityBack.style.backgroundImage
                    break
                }
                default: resetPhoto()
            }*/

            //if (document.getElementById('identity-type').value === 'passport_rus' || document.getElementById('identity-type').value === 'temporary_id_card' || document.getElementById('identity-type').value === 'transborder_passport') {
                tempWrap1.style.display = `block`
                tempWrap2.style.display = `block`
                sectionFront.style.display = `block`
                sectionBack.style.display = `block`
                sectionFront.style.backgroundImage = photoIdentityTitle.style.backgroundImage
                sectionBack.style.backgroundImage = photoIdentitySelfie.style.backgroundImage
            //} else
                if (document.getElementById('identity-type').value === 'passport_kgz' || document.getElementById('identity-type').value === 'id_kgz') {
                tempWrap1.style.display = `block`
                tempWrap2.style.display = `block`
                sectionFront.style.display = `block`
                sectionBack.style.display = `block`
                sectionFront.style.backgroundImage = photoIdentityFront.style.backgroundImage
                sectionBack.style.backgroundImage = photoIdentityBack.style.backgroundImage
            } //else resetPhoto()
        }

        btn.addEventListener('click', () => {

            if (btn.classList.contains('btn-info')) {
                btn.classList.remove('btn-info')
                resetPhoto()
            } else {
                btn.classList.add('btn-info')
                setPhoto()
            }
        })

        function resetPhoto() {
            btn.classList.remove('btn-info')
            tempWrap1.style.display = `none`
            tempWrap2.style.display = `none`
            sectionFront.style.display = `none`
            sectionBack.style.display = `none`
            content.style.display = 'block'
            document.querySelector('.pull-right').style.display = 'block'
        }


        photos.addEventListener('click', (event) => {
            //let target = event.target
            //console.log(target)
            sectionBack.style.backgroundImage = event.target.style.backgroundImage
        })

        /*content.addEventListener('wheel', (event) => {
            let target = event.target
            if (btn.classList.contains('btn-info')) {
            }
        })*/


        //sectionFront.addEventListener('mouseover', event => {
            //const target = event.target
            /*target.addEventListener('wheel', event => {
                if (event.deltaY < 0) {
                    target.style.transform = `scale(${1 - (10/100)})`
                    //el.value = el.value - 10
                    //bright(el)
                } else {
                    target.style.transform = `scale(${1 - (-10/100)})`
                    //el.value = el.value - (-10)
                    //bright(el)
                }
            })*/
        //})











    }
















    //}
//}