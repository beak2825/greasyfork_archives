// ==UserScript==
// @name        Hidden  list menu  wakanim.xyz (https://nekomori.ch player)
// @namespace    http://tampermonkey.net/
// @version      0.3.3.2
// @description Скрытие списка серий
// @author       Pin240
// @match       https://wakanim.xyz/cdn/*
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant    GM_addStyle
// @compatible   chrome Only with Tampermonkey or Violentmonkey. Только с Tampermonkey или Violentmonkey.
// @compatible   Kiwi (for Android 10)  Violentmonkey.
// @compatible   opera Only with Violentmonkey. Только с Violentmonkey.
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/426951/Hidden%20%20list%20menu%20%20wakanimxyz%20%28https%3Anekomorich%20player%29.user.js
// @updateURL https://update.greasyfork.org/scripts/426951/Hidden%20%20list%20menu%20%20wakanimxyz%20%28https%3Anekomorich%20player%29.meta.js
// ==/UserScript==
(function(){
  'use strict';

document.body.insertAdjacentHTML('beforeend', `
<style>

  .title{
    color: #000;
    font-family: Roboto, sans-serif;
    margin: 0;
    display: flex;
    visibility: hidden;
    padding: 18px 14px 18px 16px;
    font-weight: lighter;
}
.link.selected[data-v-1da8da1a], .link:hover[data-v-1da8da1a]{
                            background: #093a03;
                           }
body {

    color: #eee;
    background: #000000;
    font-family: Roboto, sans-serif;
      }


}
  
  .columns[data-v-02fe5020]{flex-direction: column;
    align-items: inherit;
    padding: 0;
     left: 3%;}

     
}
  @media only screen and (max-width: 780px){
                .columns{
                          flex-direction: column;
                          align-items: center;
                          padding: 0;
                        } 
                .abc125 {
  
            z-index: 10;
            color: #de6108;
            position: absolute;
            bottom: 98vh;
            left: 2em;
            
                      }
                 body{transform: scale(0.9);}
                                              }
  @media only screen and (max-width: 1669px){
.iframe-holder[data-v-dfdd5e74] {
    width: 100%;
}
  }
.iframe-holder[data-v-02fe5020] {
    width: 92%;
  
}
                                           
                                            
                                            
.column-right{display: none;}


  .column-left[data-v-02fe5020] {
    flex-flow: column; 
    width: 92%;
  
}
  
.column-left{
             flex-flow: column;
            }
.header[data-v-36d16126] {
    background: #202020;
    max-height: 56px;
    justify-content: space-between;
    position: absolute;
    width: 100vw;
    top: 0;
    z-index: 9;
}
   .iframe-holder {
                    width: 100%;
                  }
.buttons{
         display: inline-flex;
         
        }
.checkbox-green .checkbox-green-switch {
    bottom: 95vh;
    z-index: 140;
    position: absolute;
	display: inline-block;	
	height: 28px;
	width: 90px;
	box-sizing: border-box;
	border-radius: 2px;
	background: #848484;
	transition: background-color 0.3s cubic-bezier(0, 1, 0.5, 1);
}
.checkbox-green .checkbox-green-switch:before {
  bottom: 99em;
    z-index: 140;
    position: absolute;
	content: attr(data-label-on);
	display: inline-block;
	box-sizing: border-box;		
	width: 45px;	
	padding: 0 12px;	
	position: absolute;
	top: 0;
	left: 45px;	
	text-transform: uppercase;
	text-align: center;
	color: rgba(255, 255, 255, 0.5);
	font-size: 10px;
	line-height: 28px;
}
.checkbox-green .checkbox-green-switch:after {
  
	content: attr(data-label-off);
	display: inline-block;
	box-sizing: border-box;	
	width: 44px;	
	border-radius: 1px;	
	position: absolute;
	top: 1px;
	left: 1px;	
	z-index: 5;
	text-transform: uppercase;
	text-align: center;
	background: white;
	line-height: 26px;
	font-size: 10px;
	color: #777;	
	transition: transform 0.3s cubic-bezier(0, 1, 0.5, 1);
}
.checkbox-green input[type="checkbox"] {
	display: block;	
	width: 0;
	height: 0;	
	position: absolute;
	z-index: -1;
	opacity: 0;
}
.checkbox-green input[type="checkbox"]:checked + .checkbox-green-switch {
	background-color: #70c767;
}
.checkbox-green input[type="checkbox"]:checked + .checkbox-green-switch:before {
	content: attr(data-label-off);
	left: 0;
}
.checkbox-green input[type="checkbox"]:checked + .checkbox-green-switch:after {
	content: attr(data-label-on);
	color: #4fb743;
	transform: translate3d(44px, 0, 0);
}


</style>

<p><label class="checkbox-green">
		<input type="checkbox" class="ch">
		<span class="checkbox-green-switch" data-label-on="On" data-label-off="Off"></span>
	</label>
 </p>

	
                                      `);
//изменение чека 
$(window).keyup(function(e){
	var target = $('.checkbox-green input:focus');
	if (e.keyCode == 9 && $(target).length){
		$(target).parent().addClass('focused');
	}
});

$('.checkbox-green input').focusout(function(){
	$(this).parent().removeClass('focused');
  
}); 
  
  

   //проверка состояния
const checkbox = document.querySelector('.ch');
checkbox.addEventListener('change', function () {
    if ( this.checked ) {
        $( '.column-right' ).fadeIn( "slow" );
       
    } else $('.column-right').hide( "slow" );
})

  })();
