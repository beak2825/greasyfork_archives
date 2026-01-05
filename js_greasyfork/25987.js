// ==UserScript==
// @name         Troll
// @namespace    Trolleador
// @version      0.5
// @description  Trollear llenando el mi de imagenes y autoplays
// @author       @UnTroll
// @match        http*://www.taringa.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25987/Troll.user.js
// @updateURL https://update.greasyfork.org/scripts/25987/Troll.meta.js
// ==/UserScript==
(function($) {
    'use strict';
    //var tenminmail = '<iframe src="http://10minutemail.net/"></iframe>';
    var rand = Math.random().toString(36).substr(2, 16);
    $('head').append('<style> .noCaptcha, .captcha, .divider { display: block !important;} </style>');
    $('#name').val('Un');
    $('#lastname').val('Troll');
    $('#nick').val(rand);
    $('#dia').val('4');
    $('#mes').val('6');
    $('#anio').val('1991');
    //$('.reg-sb').append(tenminmail);
    var IMAGENES = [
        
    ];
    var Autoplays = [
        'https://my.mixtape.moe/jfcbbh.swf',
        'https://my.mixtape.moe/cnttbm.swf'
    ];
    function cazaTools() {
        function getRnd(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }
        var exists = !!$('#cazaTools').length;
        if ( !exists ) {
            $('body').append('');
            $('body').append('<style type="text/css">.cTools {-webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; float: right; width: 100px; position: fixed; top: 44%; left: 2px; padding: 10px 0; overflow: auto; border: none; -webkit-border-radius: 10px; border-radius: 10px; font: normal 16px/1 "Lucida Console", Monaco, monospace; color: rgb(255, 255, 255); text-align: center; -o-text-overflow: ellipsis; text-overflow: ellipsis; background: rgba(40,40,40,0.11); -webkit-transition: all 100ms cubic-bezier(0.25, 0.25, 0.75, 0.75); -moz-transition: all 100ms cubic-bezier(0.25, 0.25, 0.75, 0.75); -o-transition: all 100ms cubic-bezier(0.25, 0.25, 0.75, 0.75); transition: all 100ms cubic-bezier(0.25, 0.25, 0.75, 0.75); } .cTools:hover {font: normal normal bold 16px/1 "Lucida Console", Monaco, monospace; background: rgba(0,0,0,0.25); }</style>' +
                             '<style type="text/css">.cBtn {display: inline-block; -webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; width: 30px; height: 30px; cursor: pointer; margin: auto; padding: 0 auto auto; border: 1px solid rgba(255,255,255,0.3); -webkit-border-radius: 5px; border-radius: 5px; font: normal 12px/normal "Lucida Console", Monaco, monospace; color: rgba(255,255,255,0.9); -o-text-overflow: clip; text-overflow: clip; background: #000000; -webkit-box-shadow: 2px 2px 5px 0 rgba(255,255,255,0.3) ; box-shadow: 2px 2px 5px 0 rgba(255,255,255,0.3) ; -webkit-transition: all 10ms cubic-bezier(0.42, 0, 0.58, 1); -moz-transition: all 10ms cubic-bezier(0.42, 0, 0.58, 1); -o-transition: all 10ms cubic-bezier(0.42, 0, 0.58, 1); transition: all 10ms cubic-bezier(0.42, 0, 0.58, 1); } .cBtn:hover {border: 1px solid rgba(255,255,255,0.5); } .cBtn:active {border: 1px solid rgba(255,255,255,0.58); -webkit-box-shadow: 2px 2px 5px 0 rgba(255,255,255,0.3) inset; box-shadow: 2px 2px 5px 0 rgba(255,255,255,0.3) inset; }</style>' +
                             '<div id="cazaTools" class="cTools" style="position: fixed;">' +
                             '<button id="nen" title="Shoutear Imgenes" class="cBtn"><img src="https://cdn1.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2/128/death2-circle-red-128.png" height="24" width="24"></button>' +
                             '<button id="play" title="Shoutear SWF(autoplays)" class="cBtn"><img src="https://cdn3.iconfinder.com/data/icons/explosives/30/bomb-128.png" height="24" width="24"></button>' +
                             '</div>');


        }
        $('#nen').on('click', function neniy4(){
            $('#nen').css({"background-color": "red", "font-size": "200%"});
            var hash = '#FelizAñoNuevo | #2017 | #FelizAño | #paralospibes | #Clon | #sisabiacrapeabaantes | #JojosBizarreAdventure | #CalabozoDelAndroid | #humor | #troll | #LaNocheFriki | #AñoNuevo | #Shout | #LasChicasDeSebastianElCrack | #LasChicasDeScuderiaFangio | #Lolis';
            $.ajax({
                type     : 'POST',
                dataType : 'json',
                url      : '/ajax/shout/add',
                data     : {
                    key             : global_data.user_key,
                    body            : hash,
                    privacy         : 1,
                    attachment_type : 1,
                    attachment      : getRnd(IMAGENES)

                }
            });
            setInterval(neniy4, 3000);
        });
        $('#play').on('click', function auplay(){
            $('#play').css({"background-color": "green", "font-size": "200%"});
            var hash = '#FelizAñoNuevo | #2017 | #FelizAño | #paralospibes | #Clon | #sisabiacrapeabaantes | #JojosBizarreAdventure | #CalabozoDelAndroid | #humor | #troll | #LaNocheFriki | #AñoNuevo | #Shout | #LasChicasDeSebastianElCrack | #LasChicasDeScuderiaFangio | #Lolis';
            $.ajax({
                type     : 'POST',
                dataType : 'json',
                url      : '/ajax/shout/add',
                data     : {
                    key             : global_data.user_key,
                    body            : hash,
                    privacy         : 1,
                    attachment_type : 3,
                    attachment      : getRnd(Autoplays)

                }
            });
            setInterval(auplay, 5000);
        });
    }
    console.info('El mundo existe solo para las personas que se arriesgan.');
    cazaTools();
})(jQuery);