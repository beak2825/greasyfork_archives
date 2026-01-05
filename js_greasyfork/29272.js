// ==UserScript==
// @name        telegramNSFW
// @namespace   web.telegram.org
// @description Enable NSFW to media
// @include     https://web.telegram.org/*
// @version     2
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/29272/telegramNSFW.user.js
// @updateURL https://update.greasyfork.org/scripts/29272/telegramNSFW.meta.js
// ==/UserScript==

'use strict'

/* Directives */
//Obtengo el modulo donde se definen las directivas
angular.module('myApp.directives')
    // Sobre escribo la directiva para que agregue la funcion link,
    // para encapsular todo los contenidos media.
    .directive('myMessageMedia', [function() {
        return {
            link: function($scope, element, attrs) {
                // Creo el boton
                var buttonColapsable = $("<a></a>");
                // Agrego css
                buttonColapsable.addClass('btn btn-primary');

                // Agrego Icono, para saber de que tipo es.
                var buttonIcon = $("<i></i>");
                buttonIcon.addClass('icon');
                // Falta Agregar mas iconos, en este momento solo se usan los que tiene telegram
                switch ($scope.media._) {
                    case "messageMediaPhoto":
                        buttonIcon.addClass('icon-filter-photos');
                        break;
                    case "messageMediaDocument":
                        switch ($scope.media.document.type) {
                            case "gif":
                            case "video":
                                buttonIcon.addClass('icon-filter-video');
                                break;
                            case "sticker":
                                buttonIcon.addClass('icon-filter-photos');
                                break;
                            case "voice":
                            case "audio":
                                buttonIcon.addClass('icon-filter-audio');
                                break;
                            default:
                                buttonIcon.addClass('icon-filter-documents');
                                break;
                        }
                        break;
                    default:
                        break;
                }
                buttonIcon.appendTo(buttonColapsable);

                var textButton = $("<span></span>");
                textButton.text("+nsfw");

                textButton.appendTo(buttonColapsable);

                // Agrego funcion para mostrar o ocultar el contenido
                buttonColapsable.click(function() {
                    var textSwitch = $(this).children("span");
                    var divColapsable = $(this).parent().find("div.colapsable");
                    divColapsable.toggle(function() {
                        if ($(this).css("display") == "none") {
                            textSwitch.text("+nsfw");
                        } else {
                            textSwitch.text("-nsfw");
                        }
                    });
                });

                // Creo el div contenedor, que se va a ocultar el contenido
                var divColapsable = new $("<div></div>");
                divColapsable.addClass('colapsable');
                divColapsable.css("display", "none");

                // Obtengo el padre del mensaje para poder encapsular
                var myMessageMedia = element.parent();

                // Agrego el mensaje en el colapsable
                element.appendTo(divColapsable);

                // Agrego el boton
                buttonColapsable.appendTo(myMessageMedia);

                // Agrego el colapsable
                divColapsable.appendTo(myMessageMedia);
            }
        };
    }])
