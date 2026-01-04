// ==UserScript==
// @name         История доп.кнопки
// @version      0.1
// @description  ///поворот фото ///скейл фото ///кнопки и скейл в истории
// @author       qc
// @include     https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=identity
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/397421/%D0%98%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8F%20%D0%B4%D0%BE%D0%BF%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/397421/%D0%98%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8F%20%D0%B4%D0%BE%D0%BF%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8.meta.js
// ==/UserScript==

//создание инпута range
const scaleInput = document.createElement('input')
scaleInput.setAttribute('type', 'range')
scaleInput.setAttribute('step', '10')
scaleInput.setAttribute('min', '50')
scaleInput.setAttribute('value', '100')
scaleInput.setAttribute('max', '150')
scaleInput.setAttribute('title', 'Размер изображения 100%')

const content = document.getElementById('content')
content.dataset.rotate = 0
//оптимизация функций относительно алресной строки
let url = document.location.href
//console.log(url)

if (url.includes('qc?exam=dkvu')) {
    scaleInMain()
    scaleInput.style.padding = '3% 0px'
    $(document).bind("content", function (e, params) {
        if (params.rotate === false) {
            scaleInput.disabled = true
            resetScale()
        } else {
            scaleInput.disabled = false
            resetScale()
        }
    })
    //переопределение "меток"
    const tags = document.getElementById('tags')
    content.after(tags)
    tags.style.position = 'fixed'
    tags.style.top = '125px'
}

if (url.includes('qc?exam=identity')) {
    scaleInMain()
    scaleInput.setAttribute('max', '250')
    rotateInMain()

    //переопределение"меток"
    const tags = document.getElementById('tags')
    content.after(tags)
    tags.style.position = 'fixed'
    tags.style.top = '120px'
}

if (url.includes('qc?exam=sts')) {
    rotateInMain()
    scaleInMain()
}

url.includes('history?exam=') ? rotateInHistory() : ''

const resetScale = () => {
    content.style.transform = `rotate(0deg) scale(1.0)`
    scaleInput.value = '100'
    scaleInput.setAttribute('title', `Размер изображения 100%`)
    content.dataset.rotate = 0
    item_value = 0
}
function resetInfo() {
    const checkThumbNumber = document.querySelector('.check-thumb-number')
    setTimeout(() => {
        let photosSector = document.getElementById('photos')

        photosSector.before(checkThumbNumber)
        checkThumbNumber.style.bottom = '80px'
}, 300)
}

function scaleInMain() {
    const rotateBtn = document.querySelector('.rotate')
          //content = document.getElementById('content')

    const pullRight = document.querySelector('.pull-right'),
          containerFilters = pullRight.closest('.container-filters')
    containerFilters.style.zIndex = '99999'

    resetInfo()
    rotateBtn.before(scaleInput)
    scaleInput.style = 'float: left; max-width: 100px; padding: 2% 0px; margin: 0px 10px'

    scaleInput.addEventListener('change', () => {
        content.style.transform = `rotate(${content.dataset.rotate}deg) scale(${scaleInput.value/100})`
        scaleInput.setAttribute('title', `Размер изображения ${scaleInput.value}%`)
    })

    $(document).bind("select_item", function (e, params) {
        resetScale()
    })
}

let item_value = 0;

function rotateInMain() {
(function() {
    //
    const pullRight = document.querySelector('.pull-right'),
          containerFilters = pullRight.closest('.container-filters')
    containerFilters.style.zIndex = '99999'

    let allRotateBtn = document.querySelectorAll('.rotate')

    $(document).bind("content", function (e, params) {
        if (params.rotate === false) {
            allRotateBtn.forEach((btn) => {
                btn.disabled = false
                content.dataset.rotate = 0
            })
            resetScale()
        }
    })

function rotate(){
    /*let info = $('#content>i');
 if(info.length>=1){
    $('#photos').before(info);
    info.css('bottom','80px');
    $('.jhide.mkk-invite').css({'width':'max-content','z-index':'9'}).insertBefore($('#content'));
 };*/
 item_value = +$(this).attr('value') + item_value;
 $('#content').css('transform','rotate('+item_value+'deg) scale('+scaleInput.value/100+')');
    content.dataset.rotate = item_value
};


$('.rotate.btn.btn-info').each(function(){$(this).unbind('click')});

$('.rotate.btn.btn-info[value=-90]').on('click',rotate);
$('.rotate.btn.btn-info[value=180]').on('click',rotate);
$('.rotate.btn.btn-info[value=90]').on('click',rotate);
})();

(function(){
    let vinForm = $('#sts-vin')[0];
    let vinLabel = $(vinForm).siblings('label')[0];
    $(vinLabel).css('cursor','pointer')
    $(vinLabel).on('dblclick',function(){
        $(vinForm).val('00000000000000000')
    })
})();

////save pic

(function() {

   let content = $('#content');
    let photo = $('#photos')
let dropdown = $('<div/>',{
	id:'tools',
	class:'dropdown dropdown-dkk',
	css:{
		'position':'absolute',
		'right':0,
        'top': '45px'
	},
	append: $('<a/>',{
						class:'dropdown-toggle dkk-tag',
						'data-toggle':'dropdown',
						'role':'button',
						'aria-haspopup':'true',
						'aria-expanded':'false',
						text:'⯆',
						append: $('<span/>',{
							class:'js-title',
							text:'Инструменты'
						})
	}).add($('<ul/>',{
		class:'dropdown-menu',
		css:{
			padding:'5px',
            minWidth:'127px'
		},
		append:$('<li/>',{
			append:$('<a/>',{
				href:'#',
				id:'downloadPic',
				target:'_blank',
				css:{
					'padding':'3px 0'
				},
				'download':'',
				text:'Сохранить фото'
			})
		})
	}))
})

    //$(content).append(dropdown);
    $(photo).before(dropdown)
    let downLoadButton = $('#downloadPic');
    $(downLoadButton).on('click', downloadPicture)

    function downloadPicture(){
	let link = $(content)[0].style.backgroundImage.slice(4, -1).replace(/"/g, "");

console.log(link);
	$(downLoadButton)[0].href = link;
    };

})();
}

function rotateInHistory() {
    const user = document.getElementById('user'),
      btnRotate90deg = document.createElement('button'),
      btnRotateUnder90deg = document.createElement('button'),
      content = document.getElementById('content'),
      checkThumbNumber = document.querySelector('.check-thumb-number')

user.after(btnRotateUnder90deg)
btnRotateUnder90deg.textContent = '-90'
btnRotateUnder90deg.className = 'btn btn-info'
btnRotateUnder90deg.setAttribute('title', 'Поворот на минус 90 градусов')
btnRotateUnder90deg.style = 'float: right; margin: 10px;'

user.after(scaleInput)
/*scaleInput.setAttribute('type', 'range')
scaleInput.setAttribute('step', '10')
scaleInput.setAttribute('min', '50')
scaleInput.setAttribute('value', '100')
scaleInput.setAttribute('max', '150')
scaleInput.setAttribute('title', 'Размер изображения 100%')*/
scaleInput.style = 'float: right; max-width: 150px; padding: 15px 0px'

user.after(btnRotate90deg)
btnRotate90deg.textContent = '+90'
btnRotate90deg.className = 'btn btn-info'
btnRotate90deg.setAttribute('title', 'Поворот на плюс 90 градусов')
btnRotate90deg.style = 'float: right; margin: 10px;'

resetInfo()

user.closest('.container-filters').style.zIndex = 99999

let value_rotate = 0

$(document).bind("select_item", function (e, params) {
    resetScale()
    value_rotate = 0
})

function contentRotate(deg) {
    content.dataset.rotate = deg
    value_rotate += +content.dataset.rotate
    content.style.transform = `rotate(${value_rotate}deg) scale(${scaleInput.value/100})`
    return value_rotate
}

btnRotateUnder90deg.addEventListener('click', () => contentRotate(-90))
scaleInput.addEventListener('change', () => {
    content.style.transform = `rotate(${value_rotate}deg) scale(${scaleInput.value/100})`
    scaleInput.setAttribute('title', `Размер изображения ${scaleInput.value}%`)
})
btnRotate90deg.addEventListener('click', () => contentRotate(90))
}