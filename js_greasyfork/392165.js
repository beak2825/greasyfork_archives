// ==UserScript==
// @name         Munzee Clanlink Replace
// @namespace    https://greasyfork.org/users/156194
// @version      0.8
// @description  Replace Clanlinks at profile pages and clan leaderboard
// @author       rabe85
// @match        https://www.munzee.com/m/*
// @match        https://www.munzee.com/m/*/*
// @match        https://www.munzee.com/settings
// @match        https://www.munzee.com/settings/*
// @match        https://www.munzee.com/clans
// @match        https://www.munzee.com/clans/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/392165/Munzee%20Clanlink%20Replace.user.js
// @updateURL https://update.greasyfork.org/scripts/392165/Munzee%20Clanlink%20Replace.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function munzee_clanlink_replace() {

        var clanlink_firstrun = GM_getValue('clanlink_firstrun', 1);

        if(clanlink_firstrun == 1) {

            function clanlink_firstrun_button0() {
                GM_setValue('clanlink_option', 0);
                GM_setValue('clanlink_firstrun', 0);
                location.reload();
            }
            function clanlink_firstrun_button1() {
                GM_setValue('clanlink_option', 1);
                GM_setValue('clanlink_firstrun', 0);
                location.reload();
            }
            function clanlink_firstrun_button2() {
                GM_setValue('clanlink_option', 2);
                GM_setValue('clanlink_firstrun', 0);
                location.reload();
            }
            function clanlink_firstrun_button3() {
                document.getElementById('clanlink_firstrun_desc').setAttribute('style', 'display: block;font-style: normal;font-weight: lighter;');
                document.getElementById('clanlink_firstrun_input').setAttribute('style', 'display: inline;width: 200px;color: #000;padding: 5px;border-radius: 10px;font-style: normal;');
                var input_value = document.getElementById('clanlink_firstrun_input').value;
                GM_setValue('clanlink_option', 3);
                GM_setValue('clanlink_input', input_value);
                GM_setValue('clanlink_firstrun', 0);
                if(input_value != 'https://') location.reload();
            }
            document.body.insertAdjacentHTML('afterbegin', '<div style="position: fixed;left: 0px;top: 0px;height: 100%;width: 100%;background-color: black;opacity: 0.9;z-index: 9999;text-align: center;font-family: Ubuntu,sans-serif;font-weight: 400;font-style: italic;color: #fff;"><div style="margin: 50px;font-style: normal;font-size: x-large;">Munzee Clanlink Replace</div><div style="margin: 50px;color: white;font-size: larger;">Welcome, this script will change the clanlink<br>at the profile page. Please choose an option.<br><br>You can change it whenever you want<br>at your <a href="https://www.munzee.com/settings" style="color: #fff;">profile settings</a> page.</div><div><button id="clanlink_firstrun_button0" class="user-stat stat-green" style="width: 200px;padding-top: 0px;border-radius: 10px !important;margin-bottom: 15px;">Off (default link)</button><br><button id="clanlink_firstrun_button1" class="user-stat stat-green" style="width: 200px;padding-top: 0px;border-radius: 10px !important;margin-bottom: 15px;">Clan Stats by RUJA</button><br><button id="clanlink_firstrun_button2" class="user-stat stat-green" style="width: 200px;padding-top: 0px;border-radius: 10px !important;margin-bottom: 15px;">CuppaZee</button><br><button id="clanlink_firstrun_button3" class="user-stat stat-green" style="width: 200px;padding-top: 0px;border-radius: 10px !important;margin-bottom: 15px;">Own Clanlink</button><br><div style="display:none;" id="clanlink_firstrun_desc"><i class="fa fa-info-circle"></i> Use {id} for Clan ID and {name} for Clan Simple Name</div><br><input type="text" id="clanlink_firstrun_input" name="clanlink_firstrun_input" size="30" value="https://" style="display: none;"></div></div>');

            document.getElementById('clanlink_firstrun_button0').addEventListener('click', clanlink_firstrun_button0, false);
            document.getElementById('clanlink_firstrun_button1').addEventListener('click', clanlink_firstrun_button1, false);
            document.getElementById('clanlink_firstrun_button2').addEventListener('click', clanlink_firstrun_button2, false);
            document.getElementById('clanlink_firstrun_button3').addEventListener('click', clanlink_firstrun_button3, false);
            document.getElementById('clanlink_firstrun_input').addEventListener('change', clanlink_firstrun_button3, false);

        } else {

            var url_path = window.location.pathname;
            var url_array = url_path.split("/");
            var url_array_lenght = url_array.length - 1;
            var url_switch = url_array[url_array_lenght];

            var clanlink_option = GM_getValue('clanlink_option', 0);
            var clanlink_input = GM_getValue('clanlink_input', '');

            if(url_array[1] == 'settings') { // Settings page

                function clanlink_input_speichern() {
                    GM_setValue('clanlink_input', document.getElementById('clanlink_input').value);
                }
                function clanlink_option_aendern() {
                    var clanlink_option_selected = document.getElementById('clanlink_option').value;
                    GM_setValue('clanlink_option', clanlink_option_selected);
                    if(clanlink_option_selected == 3) {
                        document.getElementById('clanlink_input_div').setAttribute('style', 'margin-bottom: 25px;');
                    } else {
                        document.getElementById('clanlink_input_div').setAttribute('style', 'margin-bottom: 25px; display: none;');
                    }
                }

                document.getElementById('distance_type').parentElement.parentElement.setAttribute('style', 'margin-bottom: 10px;');

                var clanlink_option0_selected = '';
                var clanlink_option1_selected = '';
                var clanlink_option2_selected = '';
                var clanlink_option3_selected = '';
                var clanlink_input_style = 'display: none;';
                if(clanlink_option == 0) { clanlink_option0_selected = 'selected="selected"'; }
                if(clanlink_option == 1) { clanlink_option1_selected = 'selected="selected"'; }
                if(clanlink_option == 2) { clanlink_option2_selected = 'selected="selected"'; }
                if(clanlink_option == 3) { clanlink_option3_selected = 'selected="selected"'; clanlink_input_style = ''; }

                var pos = document.getElementById('email_address').parentElement.parentElement;
                pos.setAttribute('style', 'margin-bottom: 10px;');
                pos.insertAdjacentHTML('afterend', '<div class="clearfix col-xs-12 col-md-6 setting-box" style="margin-bottom: 25px;"><label for="xxlInput">Clanlink Option</label><div class="input"><select name="clanlink_option" id="clanlink_option" class="form-control"><option value="0" ' + clanlink_option0_selected + '>Off (default link)</option><option value="1" ' + clanlink_option1_selected + '>Clan Stats by RUJA</option><option value="2" ' + clanlink_option2_selected + '>CuppaZee</option><option value="3" ' + clanlink_option3_selected + '>Own Clanlink</option></select></div></div><div class="clearfix col-xs-12 col-md-6 setting-box" id="clanlink_input_div" style="margin-bottom: 25px; ' + clanlink_input_style + '"><label for="xlInput">Own Clanlink&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-weight: normal;"><i class="fa fa-info-circle"></i> Use {id} for Clan ID and {name} for Clan Simple Name</span></label><div class="input"><input class="form-control" id="clanlink_input" name="clanlink_input" size="30" type="text" value="' + clanlink_input + '"></div></div>');

                document.getElementById('clanlink_option').addEventListener('change', clanlink_option_aendern, false);
                document.getElementById('clanlink_input').addEventListener('input', clanlink_input_speichern, false);
            } else {
                if(clanlink_option == 1 || clanlink_option == 2 || clanlink_option == 3) {

                    var load_fancybox = 0;

                    function clanpage(position,id,name) {
                        if(clanlink_option == 1) { // Clan Stats by RUJA
                            if(id != 0 || name != '') {
                                if(id != 0) {
                                    position.setAttribute('data-src','https://stats.munzee.dk/?' + id);
                                    load_fancybox = 1;
                                } else {
                                    position.setAttribute('data-src','https://stats.munzee.dk/?clan_name' + name);
                                    load_fancybox = 1;
                                }
                            }
                        } else {
                            if(clanlink_option == 2) { // CuppaZee
                                if(id != 0) {
                                    position.setAttribute('data-src','https://cuppazee.app/clan/' + id);
                                    load_fancybox = 1;
                                }
                            } else {
                                position.setAttribute('data-src',clanlink_input.replace(/{id}/g,id).replace(/{name}/g,name));
                                load_fancybox = 1;
                            }
                        }
                        if(load_fancybox == 1) {
                            position.setAttribute('href', 'javascript:;');
                            position.setAttribute('title', 'Open Clanpage (external link)');
                            position.setAttribute('data-fancybox', '');
                            position.setAttribute('data-type', 'iframe');
                        }
                    }

                    if(url_array[1] == 'clans') { // Clan Leaderboards
                        var leaderboard_tr0 = document.getElementsByClassName('table')[0].getElementsByTagName('tr');
                        for(var ltr = 0, leaderboard_tr; !!(leaderboard_tr=leaderboard_tr0[ltr]); ltr++) {
                            var leaderboard_clanid = 0;
                            var leaderboard_clanname = '';
                            var leaderboard_logo = leaderboard_tr.querySelector('img[data-src*=clan_logos]');
                            var leaderboard_logo_src = '';
                            if(leaderboard_logo) {
                                leaderboard_logo_src = leaderboard_logo.getAttribute('data-src');
                                leaderboard_logo.setAttribute('src', leaderboard_logo_src); // Workaround, lazy loading doesn't work anymore
                            }
                            if(leaderboard_logo_src) {
                                leaderboard_clanid = parseInt((leaderboard_logo_src.match(/clan_logos\/([^/.]+)\.png/)||[])[1],36);
                            }
                            if(leaderboard_clanid != 0) {
                                var leaderboard_td0 = leaderboard_tr.getElementsByTagName('td');
                                for(var ltd = 0, leaderboard_td; !!(leaderboard_td=leaderboard_td0[ltd]); ltd++) {
                                    leaderboard_td.innerHTML = '<a href="javascript:;" id="leaderboard_tr' + ltr + 'td' + ltd + '" title="Open Clanpage (external link)" data-fancybox data-type="iframe">' + leaderboard_td.innerHTML + '</a>';
                                    clanpage(document.getElementById('leaderboard_tr' + ltr + 'td' + ltd),leaderboard_clanid,leaderboard_clanname);
                                }
                            }
                        }
                    } else { // Player profile
                        var clanlink_replace0 = document.querySelectorAll('a[href^="/clans/"]');
                        for(var cr = 0, clanlink_replace; !!(clanlink_replace=clanlink_replace0[cr]); cr++) {
                            var clanid = 0;
                            var clanname = '';
                            var logo = document.querySelector('img[src*=clan_logos]');
                            var logo_src = '';
                            var link = clanlink_replace.getAttribute('href');
                            if(logo) {
                                logo_src = logo.getAttribute('src');
                            }
                            if(logo_src) {
                                clanid = parseInt((logo_src.match(/clan_logos\/([^/.]+)\.png/)||[])[1],36);
                            }
                            if(link) {
                                clanname = link.split('/')[link.split('/').length - 2];
                            }
                            clanpage(clanlink_replace,clanid,clanname);
                        }
                    }

                    if(load_fancybox == 1) {
                        var load_fancybox_css = document.createElement('link');
                        load_fancybox_css.rel = 'StyleSheet';
                        load_fancybox_css.type = 'text/css';
                        load_fancybox_css.href = 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.css';
                        document.head.appendChild(load_fancybox_css);

                        var load_fancybox_script = document.createElement('script');
                        load_fancybox_script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js';
                        document.body.appendChild(load_fancybox_script);
                    }
                }
            }
        }

    }


    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        munzee_clanlink_replace();
    } else {
        document.addEventListener("DOMContentLoaded", munzee_clanlink_replace, false);
    }

})();