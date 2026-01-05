// ==UserScript==
// @name         Add extra forums
// @namespace    pxgamer
// @author       pxgamer
// @description  add extra forums
// @include      *kat.cr/community/
// @version      0.4
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/18892/Add%20extra%20forums.user.js
// @updateURL https://update.greasyfork.org/scripts/18892/Add%20extra%20forums.meta.js
// ==/UserScript==


$(function(){
    $('#wrapperInner div.mainpart table tbody tr td.communityLayout table thead').after('<tbody id="fcf">'+
                                         '<td colspan="4" title="Click to hide" data-show-title="Click to show" data-hide-title="Click to hide" class="forumGroupName lightivorybg thin white left font14px" style="cursor: pointer" rel="custom_forums">'+
                                             '<a class="plain white">'+
                                                 'Custom Forums'+
                                             '</a>'+
                                         '</td>'+
                                     '</tbody>');
    console.log('added main');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div>'+
                                                     '<a class="cellMainLink" href="/community/torrent-requests/"><strong>Torrent Requests</strong></a>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
});

$('#fcf').on('click', function() {
    $('#forum_custom_forums').toggle();
});
