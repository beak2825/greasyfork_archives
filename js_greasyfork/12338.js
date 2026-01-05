	

    // ==UserScript==
    // @name        Facepunch-Raiting/Post-Updater *HTTPS WORKING*
    // @namespace   123
    // @description w/e - Updated by Shotz
    // @include     https://facepunch.com/showthread.php*
    // @version     1.2
// @downloadURL https://update.greasyfork.org/scripts/12338/Facepunch-RaitingPost-Updater%20%2AHTTPS%20WORKING%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/12338/Facepunch-RaitingPost-Updater%20%2AHTTPS%20WORKING%2A.meta.js
    // ==/UserScript==
     
    $(function() {
            var title = document.title;
           
            var s = document.createElement('style');
           
            s.appendChild(document.createTextNode(
                    '.updatemenu {\
                            position:relative;\
                            margin-bottom:1em;\
                            float:left;\
                    }\
                    \
                    .updatemenu span {\
                            float:left;\
                    }\
                    \
                    .updatemenu span a {\
                            text-decoration:none;\
                            cursor:pointer;\
                            color:#417394;\
                    }\
                    \
                    .updatemenu span a label {\
                            cursor:inherit;\
                    }\
                    \
                    .updatemenu span a input {\
                            vertical-align:text-top;\
                            margin:0 2px;\
                    }\
                    \
                    .updatemenu span.selected {\
                            cursor:default;\
                            background: url("images/buttons/newbtn_middle.png") repeat-x scroll 0% 0% rgb(117, 159, 187);\
                            font-weight:bold;\
                    }\
                    \
                    .postbitnewline {\
                            border-top:4px solid rgb(199, 13, 13) !important;\
                    }'
            ));
           
            document.getElementsByTagName('head')[0].appendChild(s);
     
            if($('#pagination_bottom').length < 1) {
                    $('#postlist').after(
                            '<div id="below_postlist" class="noinlinemod below_postlist">\
                                    <div id="pagination_bottom" class="pagination_bottom">\
                                    </div>\
                            </div>'
                    );
            };
           
            $('#pagination_bottom').append(
                    '<div class="updatemenu popupmenu nohovermenu">\
                            <span>\
                                    <a class="popupctrl" id="updatemanual">Update</a>\
                            </span>\
                            <span>\
                                    <a>\
                                            <label>\
                                                    <input type="checkbox" id="chkautoupdate"></input>\
                                                    Auto\
                                            </label>\
                                    </a>\
                            </span>\
                            <span id="autoupdatetimer" class="selected" style="display:none;">\
                                    <a>10</a>\
                            </span>\
                    </div>'
            );
           
            var intervalUpdate, isUpdating;
            var delays = [10, 15, 30, 60];
            var updateDelay = 0;
            var endOfPage = false;
            var threadid = $('#qr_threadid').val();
     
            function update(wasAuto) {
                    isUpdating = true;
                   
                    $.get(document.URL, {}, function(data) {
                            var max = 0
                            $('#posts li').each(function() {
                                    max = Math.max(max, parseInt($(this).attr('id').substr(5)));
                                    $(this).removeClass('postbitnew').addClass('postbitold');
                                    $(this).removeClass('postbitnewline');
                                    document.title = title;
                            });
                           
                            var numnew = 0;
                           
                            var posts = $('#posts li', data);
                            posts.each(function() {
                                    var id = parseInt($(this).attr('id').substr(5));
                                    if(id > max) {
                                            if(numnew < 1) {
                                                    $(this).addClass('postbitnewline');
                                            };
                                           
                                            $('#posts').append(this);
                           
                                            numnew++;
                                    } else {
                                            $('#' + $(this).attr('id') + ' .date').html($('.date', this).html());
                                            $('#rating_' + id).html($('#rating_' + id, this).html());
                                    };
                            });
                           
                            $('.pagination').html($('.pagination', data).html());
                           
                            if($('.pagination').length < 1 || $('.pagination span').last().hasClass('selected')) {
                                    if(numnew < 1) {
                                            $('#autoupdatetimer a').text('No new posts.');
                                            if(wasAuto) {
                                                    updateDelay = Math.min(updateDelay + 1, delays.length - 1);
                                            };
                                    } else {
                                            $('#autoupdatetimer a').text(numnew + ' new post' + (numnew > 1 ? 's' : ''));
                                            document.title = title + ' (' + numnew + ')'
                                            if(wasAuto) {
                                                    updateDelay = Math.max(updateDelay - 1, 0);
                                            };
                                    };
                            } else {
                                    wasAuto = false;
                                    endOfPage = true;
                                    $('#autoupdatetimer').css('display', 'inline');
                                    $('#autoupdatetimer a').text('No more posts on this page.');
                                    $('#chkautoupdate').attr('disabled', 'disabled');
                            };
                           
                            if(wasAuto) {
                                    intervalUpdate = setInterval(updateTimer, 1000);
                            }
                           
                            isUpdating = false;
                    });
            };
           
            $('#updatemanual').click(function() {
                    if(!isUpdating && !endOfPage) {
                            $('#autoupdatetimer').css('display', 'inline');
                            $('#autoupdatetimer a').text('Updating...');
                            update(!isNaN(intervalUpdate));
                            intervalUpdate = clearInterval(intervalUpdate);
                            return false;
                    };
            });
           
            function updateTimer() {
                    if(isUpdating) intervalUpdate = clearInterval(intervalUpdate);
                    var span = $('#autoupdatetimer a');
                    var time = parseInt((span.text().search(/[^\d]/) >= 0 ? '' : span.text()));
                   
                    if(!isNaN(time)) {
                            if(time <= 1) {
                                    span.text('Updating...');
                                    intervalUpdate = clearInterval(intervalUpdate);
                                    update(true);
                            } else {
                                    span.text(time - 1);
                            };
                    } else {
                            span.text(delays[updateDelay] - 1);
                    };
            };     
           
            $('#chkautoupdate').change(function() {
                    if($(this).is(':checked')) {
                            $('#autoupdatetimer').css('display', 'inline');
                            $('#autoupdatetimer a').text(delays[updateDelay]);
                            intervalUpdate = setInterval(updateTimer, 1000);
                            localStorage.setItem(threadid, true);
                    } else {
                            $('#autoupdatetimer').css('display', 'none');
                            intervalUpdate = clearInterval(intervalUpdate);
                            localStorage.removeItem(threadid);
                    };
            });
           
            if(localStorage.getItem(threadid) == "true") {
                    $('#chkautoupdate').attr('checked', 'checked');
                    $('#chkautoupdate').change();
            } else {
                    $('#chkautoupdate').removeAttr('checked');
            };
    });

