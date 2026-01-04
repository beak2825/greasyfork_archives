// ==UserScript==                                                                                    
// @name         Non display rating on Codeforces                                                    
// @name:ja      Codeforces の Rating 関連情報を非表示にする UserScript                              
// @namespace    https://greasyfork.org/ja/scripts/376735-non-display-rating-on-codeforces/          
// @version      0.91                                                                                
// @description:en Hide Rating related info on Codeforces                                            
// @description:ja Codeforces でレーティング関連の情報やリンクを非表示にします                       
// @author       Yoshinari Takaoka                                                                   
// @match        https://codeforces.com/                                                             
// @match        https://codeforces.com/top                                                          
// @match        https://codeforces.com/groups                                                       
// @match        https://codeforces.com/calendar                                                     
// @match        https://codeforces.com/profile/*                                                    
// @match        https://codeforces.com/blog/entry/*                                                 
// @match        https://codeforces.com/settings/*                                                   
// @match        https://codeforces.com/contestRegistrants/*                                         
// @match        https://codeforces.com/contestRegistration/*                                        
// @require      https://code.jquery.com/jquery-3.3.1.min.js                                         
// @grant        none                                                                                
// @description Hide Rating related info on Codeforces                                               
// @downloadURL https://update.greasyfork.org/scripts/376735/Non%20display%20rating%20on%20Codeforces.user.js
// @updateURL https://update.greasyfork.org/scripts/376735/Non%20display%20rating%20on%20Codeforces.meta.js
// ==/UserScript==                                                                                     

(function() {
    'use strict';
    var $ = window.jQuery;
    $(".personal-sidebar > div:eq(1) > ul:eq(0)").hide();
    $("div.info > ul:eq(0) > li:eq(0)").hide();
    $("div.info > ul:eq(0) > li:eq(1)").hide();
    $("div.info > ul:eq(0) > li:eq(2)").hide();
    $("div#placeholder").hide();
    $("a[href='/ratings']").hide();
    $("div.main-info > h1:eq(0) > a:eq(0)").removeAttr("class").removeAttr("title");
    $("div.user-rank").hide();
})();