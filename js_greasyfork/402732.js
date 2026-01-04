// ==UserScript==
// @name         history
// @version      0.1
// @description  История в таксометре
// @author       nmynov
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc?exam=identity
// @namespace
// @namespace https://greasyfork.org/users/468849
// @downloadURL https://update.greasyfork.org/scripts/402732/history.user.js
// @updateURL https://update.greasyfork.org/scripts/402732/history.meta.js
// ==/UserScript==
const
      cont=document.getElementById('content'),
      identityDataForm = document.getElementById('identity-data-form'),
      history = document.createElement('div')
history.setAttribute('id','history')
history.setAttribute('style','overflow-y: auto; overflow-x: hidden;background-color: white;border-radius: 4px; margin-top: 10px')
identityDataForm.append(history)
  let art = document.createElement('div')
      art.className = "alert";
      art.innerHTML = `<center><strong>История</strong></center> `;
      art.setAttribute('style','width:240px;height:40px;color: white; background-color: red;border-radius: 3px;display:none;position: absolute ;z-index:99999; ')
const tgs = document.getElementById('tags'),
      btnNeOK=document.getElementById('btn-block'),
filter = document.querySelectorAll('.container-filters')[1]
filter.prepend(art)



let id
const checkSelect = () => {
    const itemSelect = document.querySelector('tr.selected')
    id = "id="+itemSelect.dataset.driverId+"&mode=license_number"
}
const Zapros=() => {
let xhr = new XMLHttpRequest()
xhr.onreadystatechange=function(){
if(this.readyState==4 && this.status==200){
     history.innerHTML=(this.responseText)
//Выравнивание
    $("#history").find('table').each(function(){
$(this).css('margin','auto')});
//Выносим логин асессора
    $("#history").find('b').each(function(){
var asessor =$(this).closest('tr').data('user');
$(this).replaceWith(asessor);
});
//Выносим замечание
    $("#history").find('.gray').each(function(){
var title =$(this).closest('tr').data('title');
var formTitle='<strong>'+title+'</strong>'
$(this).before('—',formTitle);
});
//Выносим недостающие фото
    $("#history").find('.car-images.center').each(function(){
var photo =$(this).closest('tr').data('original');
var Registration = '<div class="car-images-group"><div class="cover" style="border-radius: 4px;background-image: url('+ photo.IdentityRegistration +')"></div> </div>';
if((photo.IdentityFront)===undefined){var Front=null}else{Front = '<div class="car-images-group"><div class="cover" style="border-radius: 4px;background-image: url('+ photo.IdentityFront +')"></div> </div>';}//Исключаем пустые блоки
if((photo.IdentityBack)===undefined){var Back=null}else{ Back = '<div class="car-images-group"><div class="cover" style="border-radius: 4px;background-image: url('+ photo.IdentityBack +')"></div> </div>';}//Исключаем пустые блоки
$(this).append(Registration).append(Front).append(Back)
});
//Выносим время поверх фото
   $("#history").find('.content').each(function(){
   $(this).css('z-index','9998')});
//Изменение цвета при наведении
$("#history").find('tr').bind({
'mouseover':function() { $(this).css("background-color", "lightblue"); },
'mouseout':function() { $(this).css("background-color", "white"); },
});
}}

xhr.open('POST', 'https://taximeter-admin.taxi.yandex-team.ru/qc/history/items?exam=identity&limit=5', false);

xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xhr.setRequestHeader("x-requested-with","XMLHttpRequest");
xhr.setRequestHeader("x-taximeter-antiforgery",token)

xhr.send(id);

}

$(document).bind("item_info", function (e, params) {
    checkSelect()
})
cont.addEventListener('click', () => Zapros())
//Закрытие истории
document.getElementById('table').addEventListener('click', () =>{history.innerHTML=null})
//Отображение фото из истории в content
let ur
document.getElementById('history').addEventListener("click", function (e) {
ur=(e.target.style.backgroundImage)
if((e.target.style.backgroundImage)!=''){
document.getElementById('content').style.backgroundImage=(e.target.style.backgroundImage)}
    });
//Метка "История"
 function metka(){
let
  pit=document.getElementById('photo-IdentityTitle').style.backgroundImage.split('?')[0],
  pis=document.getElementById('photo-IdentitySelfie').style.backgroundImage.split('?')[0],
  pir=document.getElementById('photo-IdentityRegistration').style.backgroundImage.split('?')[0],
  pif=document.getElementById('photo-IdentityFront').style.backgroundImage.split('?')[0],
  pib=document.getElementById('photo-IdentityBack').style.backgroundImage.split('?')[0],
  cnt=document.getElementById('content').style.backgroundImage.split('?')[0]
if((cnt==pit)||(cnt==pis)||(cnt==pir)||(cnt==pif)||(cnt==pib)){
art.style.display = "none"
}else{art.style.display = "block"}
}
document.addEventListener('mousemove',() =>metka())
document.addEventListener('keydown',() =>metka())

