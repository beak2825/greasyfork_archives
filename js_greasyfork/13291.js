// ==UserScript==
// @name         Timout Dialog Disabler for Sakai
// @version      1.5
// @description  A quick tweak of Sakai
// @author       Luke Lazurite
// @match        http://sakai.umji.sjtu.edu.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @namespace https://greasyfork.org/users/18585
// @downloadURL https://update.greasyfork.org/scripts/13291/Timout%20Dialog%20Disabler%20for%20Sakai.user.js
// @updateURL https://update.greasyfork.org/scripts/13291/Timout%20Dialog%20Disabler%20for%20Sakai.meta.js
// ==/UserScript==
if(top === window) {
    console.log('triggered');
    window.addEventListener('load', function() {
        $.ajax({
            url: '/direct/session/current.json', 
            dataType: "json",
            success: function(data) {
                if (! data.userEid && GM_getValue('sakai-auto-login')) {
                    $.ajax({
                        url: '/portal/xlogin',
                        type: 'POST',
                        data: {
                            eid: GM_getValue('sakai-username'),
                            pw: GM_getValue('sakai-password')
                        },
                        success: function() {
                            location.reload();
                        },
                        error: function (jqXHR, textStatus) {
                            if (jqXHR.status === 403) {
                                GM_deleteValue('sakai-auto-login');
                                GM_deleteValue('sakai-username');
                                GM_deleteValue('sakai-password');
                                alert('Authentication failed, the stored credential has been deleted.');
                            }
                        }
                    })
                }
            }
        });

        if (window.portal) {
            window.portal.timeoutDialog.enabled = false;
        }
        setInterval(function() {
            $.ajax({
                url: '/direct/session/current.json',
                dataType: "json"
            });
        }, 300000);
        $('form[action="http://sakai.umji.sjtu.edu.cn/portal/xlogin"]').submit(function(){
            if (sakaiAutoLogin = GM_getValue('sakai-auto-login') === undefined) {
                GM_setValue('sakai-auto-login', confirm('Do you want sakai to login automatically?'));
                sakaiAutoLogin = GM_getValue;
                GM_setValue('sakai-username', $('input#eid').val());
                GM_setValue('sakai-password', $('input#pw').val());
            }
        });
    }, false);
}
