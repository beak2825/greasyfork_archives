// ==UserScript==
// @name         Add extra forums (Own use)
// @namespace    Bartacus
// @author       Bartacus
// @description  add extra forums
// @include      *kat.cr/community/
// @version      2.0
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/18924/Add%20extra%20forums%20%28Own%20use%29.user.js
// @updateURL https://update.greasyfork.org/scripts/18924/Add%20extra%20forums%20%28Own%20use%29.meta.js
// ==/UserScript==


$(function(){
    $('#forum_private_forums').after('<tbody id="fcf">'+
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
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/site-news-announcements//"><strong>Site News and Announcements</strong></a>'+
                                                     '<span class="underlined font11px lightgrey block">Important Bullshit</span>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/movies/"><strong>Movies</strong></a>'+
                                                        '<span class="underlined font11px lightgrey block">Movies</span>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/adult-talk/"><strong>Adult Talk</strong></a>'+
                                                            '<span class="underlined font11px lightgrey block">Where Adults Act Like Little Kids</span>'+
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
                                                                        '<span class="underlined font11px lightgrey block">A lot of Bullshit</span>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/show/dutch-corner/"><strong>The Dutch Corner</strong></a>'+
                                                     '<span class="underlined font11px lightgrey block">The Dutchies</span>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/vip-lounge/"><strong>VIP Lounge</strong></a>'+
                                                            '<span class="underlined font11px lightgrey block">aka The Nut House</span>'+
                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
    $('#fcf').after('<tbody id="forum_custom_forums">'+
                                        '<tr class="odd">'+
                                            '<td>'+
                                                 '<div class="bart">'+
                                                     '<a class="cellMainLink" href="/community/translator-forum/"><strong>Translator Forum</strong></a>'+
                                                          '<span class="underlined font11px lightgrey block">Translations and Shit</span>'+ 

                                                 '</div>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>');
    console.log('added content');
});

$('#fcf').on('click', function() {
    $('#forum_custom_forums').toggle();
});