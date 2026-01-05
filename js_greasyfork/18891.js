// ==UserScript==
// @name         Add extra forums
// @namespace    Boba Fett A.K.A Bart
// @author       Boba Fett A.K.A Bart
// @contributor  PXGamer
// @description  add extra forums
// @include      *kat.cr/community/
// @version      0.00000006
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/18891/Add%20extra%20forums.user.js
// @updateURL https://update.greasyfork.org/scripts/18891/Add%20extra%20forums.meta.js
// ==/UserScript==


$(function(){
    $('#wrapperInner div.mainpart table tbody tr td.communityLayout table thead').after('<tbody id="fcf">'+
                                         '<td colspan="4" title="Click to hide" data-show-title="Click to show" data-hide-title="Click to hide" class="forumGroupName lightivorybg thin white left font14px" style="cursor: pointer" rel="custom_forums">'+
                                             '<a class="plain white">'+
                                                 'My Custom Forums'+
                                             '</a>'+
                                         '</td>'+
                                     '</tbody>');
    console.log('added main');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/torrent-requests/"><strong>Torrent Requests</strong></a>'+
                                                     '<span class="underlined font11px lightgrey block">Adopt an uploader Program &</span><span class="underlined font11px lightgrey block">TV, Music, Apps, Games & Books request threads</span>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/introduction/"><strong>Introduction</strong></a>'+
                                                        '<span class="underlined font11px lightgrey block">Duhh! lol</span>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/tutorials/"><strong>Tutorials</strong></a>'+
                                                            '<span class="underlined font11px lightgrey block">The tutorials forum</span>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/free-speech/"><strong>Free Speech</strong></a>'+
                                                                        '<span class="underlined font11px lightgrey block">Duhh!</span>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/encoding/"><strong>Encoding</strong></a>'+
                                                     '<span class="underlined font11px lightgrey block">Ask an Experienced Encoder Here & other encoding threads</span>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/general-troubleshooting/"><strong>General Troubleshooting</strong></a>'+
                                                            '<span class="underlined font11px lightgrey block">Need Help? Ask Super Users & Experienced Site Members Here & Help and Advice for new Uploaders</span>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/torrent-issues/"><strong>Torrent Issues</strong></a>'+
                                                          '<span class="underlined font11px lightgrey block">Torrents that need updating by mods &</span><span class="underlined font11px lightgrey block">Torrents cat. changing for SU & Xlators</span>'+

                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/site-problems/"><strong>Site Problems</strong></a>'+
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
                                                     '<a class="cellMainLink" href="/community/general-torrent-discussions/"><strong>General Torrent Discussions</strong></a>'+
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