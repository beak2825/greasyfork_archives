// ==UserScript==
// @name         HdFull Season Button
// @namespace    https://greasyfork.org
// @version      0.1.5
// @description  Permite marcar como 'no vistos' todos los episodios de una temporada, modificando el botón cuando todos los episodios aparecen como 'vistos'.
// @match        https://*/serie/*/temporada-*
// @icon         https://www.google.com/s2/favicons?domain=hd-full.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418299/HdFull%20Season%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/418299/HdFull%20Season%20Button.meta.js
// ==/UserScript==

if (document.getElementById('header-signin') == null) {

    var seasonButtons = document.getElementsByClassName('season-mark-view');

    // Oculta el botón original de HdFull
    seasonButtons[0].style.display = 'none';

    var newButtonsHTML = `
        <div class="season-mark-view" style="display: block;">
            <ul class="filter">
                <li class="current">
                    <a href="#" onclick="
                        var addWatchSeason = function() {
                            var ids = [];
                            $('.show-view').each(function() {
                                ids.push($(this).data('episode'));
                            });
                            addMultipleWatch(ids,3);
                            $('.seen-box').show();
                            $('.season-mark-view')[1].style.display = 'none';
                            $('.season-mark-view')[2].style.display = 'block';
                        }

                        var addMultipleWatch = function(ids,type){
                            if($.isArray(ids)) {
                                $.post('/a/status',{
                                    target_id: ids.join(),
                                    target_type: type,
                                    target_status: 1
                                },function(resp) {
                                    $.each(ids,function(idx, id) {
                                        updateStatus(type, id, 1);
                                    });
                                });
                            }
                        }
                        addWatchSeason();
                    ">Marcar todos como vistos</a>
                </li>
            </ul>
        </div>
        <div class="season-mark-view" style="display: none;">
            <ul class="filter">
                <li class="current">
                    <a href="#" onclick="
                        var removeWatchSeason = function() {
                            var ids = [];
                            $('.show-view').each(function() {
                                ids.push($(this).data('episode'));
                            });
                            removeMultipleWatch(ids,3);
                            $('.seen-box').hide();
                            $('.season-mark-view')[1].style.display = 'block';
                            $('.season-mark-view')[2].style.display = 'none';
                        }

                        var removeMultipleWatch = function(ids,type){
                            if($.isArray(ids)) {
                                $.post('/a/status',{
                                    target_id: ids.join(),
                                    target_type: type,
                                    target_status: 0
                                },function(resp) {
                                    $.each(ids,function(idx, id) {
                                        updateStatus(type, id, 0);
                                    });
                                });
                            }
                        }
                        removeWatchSeason();
                    ">Desmarcar todos como vistos</a>
                </li>
            </ul>
        </div>`;

    seasonButtons[0].insertAdjacentHTML('afterend', newButtonsHTML);

    // Actualiza el botón de marcar/desmarcar al estado actual adeacuado
    var checkWatched = function() {
        var countUnwatched = 0;
        document.querySelectorAll(".seen-box").forEach(function(currentValue) {
            if (currentValue.style.display == "" || currentValue.style.display == 'none') {
                ++countUnwatched;
            }
        });

        if (countUnwatched != 0) {
            // Muestra el botón 'Marcar' y oculta el botón 'Desmarcar'
            seasonButtons[1].style.display = 'block';
            seasonButtons[2].style.display = 'none';
        } else {
            // Oculta el botón 'Marcar' y muestra el botón 'Desmarcar'
            seasonButtons[1].style.display = 'none';
            seasonButtons[2].style.display = 'block';
        }
    }

    window.onload = function() {
        setTimeout(function() {
            checkWatched();

            document.querySelectorAll(".actions-seen").forEach(function(c) {
                c.onclick = function(){
                    setTimeout(function() {
                        checkWatched();
                    }, 500);
                }
            });
        }, 700);
    }
}