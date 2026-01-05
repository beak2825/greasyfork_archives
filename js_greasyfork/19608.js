// ==UserScript==
// @name         The script to add threads in the community page
// @namespace    Boba Fett A.K.A Bart
// @author       Boba Fett A.K.A Bart
// @description  add  threads
// @include      *kat.cr/community/
// @version      0.00000007
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/19608/The%20script%20to%20add%20threads%20in%20the%20community%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/19608/The%20script%20to%20add%20threads%20in%20the%20community%20page.meta.js
// ==/UserScript==


$(function(){
    $('#wrapperInner div.mainpart table tbody tr td.communityLayout table thead').after('<tbody id="fcf">'+
                                         '<td colspan="4" title="Click to hide" data-show-title="Click to show" data-hide-title="Click to hide" class="forumGroupName lightivorybg thin white left font14px" style="cursor: pointer" rel="custom_forums">'+
                                             '<a class="plain white">'+
                                                 'My Custom threads'+
                                             '</a>'+
                                         '</td>'+
                                     '</tbody>');
    console.log('added main');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/show/official-movie-request-thread-v3/?page=1000"><strong>Official Movie Request Thread V3</strong></a>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/show/official-software-request-thread/?page=1000"><strong>Official Software Request Thread</strong></a>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/https://kat.cr/community/show/torrents-need-updating-kat-changing-mod-work-thread-only-v6/?page=1000"><strong>Torrents that need updating/ Mod Work Thread Only..V6</strong></a>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/show/xxx-adult-reseed-request-thread-v-1/?page=1000"><strong>XXX/Adult RESEED Request Thread V.1</strong></a>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/show/adopt-xxx-uploader/?page=1000"><strong>Adopt an XXX uploader</strong></a>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/show/torrents-need-category-change-post-here-super-users-amp-tran/?page=1000"><strong>Torrents That Need a Category Change-For SUs & Xlators To Move</strong></a>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/show/post-threads-need-be-moved-or-trashed-v2-thread-108123/?page=last"><strong>Post Threads that Need to be Moved or Trashed V2</strong></a>'+

                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/show/adopt-uploader-program-v13-all-users-help/?page=1000"><strong>**Adopt an uploader Program v13-- For all Users to Help**</strong></a>'+
                                                          '<span class="underlined font11px lightgrey block">KATs Problems thread and other threads</span>'+

                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href=/community/torrent-requests/"><strong>Torrent Requests</strong></a>'+
                                                          '<span class="underlined font11px lightgrey block">Post threads that need to be moved or trashed &</span><span class="underlined font11px lightgrey block">Post inactive verified uploaders & Why we do what we do  </span>'+

                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
});

$('#fcf').on('click', function() {
    $('#forum_custom_forums').toggle();
});