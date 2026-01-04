// ==UserScript==
// @name         DeskWall Tools Pluss
// @namespace    http://tampermonkey.net/
// @version      2.5.4
// @description  DeskWall Tools optimizations
// @author       StvnMrtns
// @include      /^https?://(\d+\.){3}\d+\:54381/support/.*/
// @include      /^https?://(\d+\.){3}\d+\:54318/deskwall/.*/
// @include      /^https?://(\d+\.){3}\d+\:54318/apimanager/.*/
// @include      /^https?://(\d+\.){3}\d+\:54318/conectorapp/
// @include      /^https?://(\d+\.){3}\d+\:54318/conectorapp/.*/
// @include      /^https?://(\d+\.){3}\d+\:54318/remote/.*/
// @icon         https://www.google.com/s2/favicons?sz=96&domain=gesab.com
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @require      https://update.greasyfork.org/scripts/403344/805187/Momentjs%20v2253.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/530194/DeskWall%20Tools%20Pluss.user.js
// @updateURL https://update.greasyfork.org/scripts/530194/DeskWall%20Tools%20Pluss.meta.js
// ==/UserScript==

var dw_users;
var dw_desks;

(function() {
    'use strict';

    var version_name = '';

    //var version_old = 'https://greasyfork.org/en/scripts/471205-deskwall-tools-plus';

    $.when(load_dw_users(), load_dw_desks()).done(function(data_load_dw_users, data_load_dw_desks){

        // base structure
        editBaseStructure(version_name);
        // base CSS
        editBaseCSS();

        // custom structure
        editCustomStructure();

        // init
        initPages();
    });

})();

// ***********************************************
// Init pages
// ***********************************************
function initPages()
{
    var page_url = window.location.href;

    // PAGES
    var page_login = page_url.indexOf('/login') >= 0 && page_url.indexOf('/login_ad') == -1;
    var page_config_config = page_url.indexOf('/deskwall/config') >= 0 && page_url.indexOf('gotopage') == -1;
    var page_config_config_domain = page_url.indexOf('/deskwall/config/domain') >= 0 && page_url.indexOf('gotopage') == -1;
    var page_config_config_proxy = page_url.indexOf('/deskwall/config/proxy') >= 0 && page_url.indexOf('gotopage') == -1;
    var page_config_device = page_url.indexOf('/deskwall/device') >= 0 && page_url.indexOf('gotopage') == -1;
    var page_config_users = page_url.indexOf('/deskwall/users') >= 0 && page_url.indexOf('gotopage') == -1;
    var page_config_groups = page_url.indexOf('/deskwall/groups') >= 0 && page_url.indexOf('gotopage') == -1;
    var page_config_access = page_url.indexOf('/deskwall/tab') >= 0 && page_url.indexOf('gotopage') == -1;
    var page_config_grids = page_url.indexOf('/deskwall/grids') >= 0 && page_url.indexOf('gotopage') == -1;
    var page_config_sources = page_url.indexOf('/deskwall/apps') >= 0 && page_url.indexOf('gotopage') == -1;
    var page_config_actions = page_url.indexOf('/deskwall/actions') >= 0 && page_url.indexOf('gotopage') == -1;
    var page_config_menus = page_url.indexOf('/deskwall/menus') >= 0 && page_url.indexOf('gotopage') == -1;
    var page_config_sessions = page_url.indexOf('/deskwall/session') >= 0 && page_url.indexOf('gotopage') == -1;
    var page_support = page_url.indexOf('/support') >= 0;
    var page_apitool_api_triggers = page_url.indexOf('/apimanager/customtrigger') >= 0;
    var page_apitool_api_calls = page_url.indexOf('/apimanager/apicall') >= 0;
    var page_apitool_api_conns = page_url.indexOf('/apimanager/customconector') >= 0;
    var page_apitool_apps = page_url.indexOf('/conectorapp') >= 0;
    var page_apitool_app_login = page_url.indexOf('/conectorapp/login_ad') >= 0;
    var page_apitool_app_logout = page_url.indexOf('/conectorapp/logout_device') >= 0;
    var page_apitool_app_reset = page_url.indexOf('/conectorapp/conn_reset_session') >= 0;


    // GLOBAL

    // global CSS
    editGlobalCSS();

    // global login
    if(page_login)
    {
        editPageLogin();
    }


    // PAGES CONFIG

    // config - config
    if(page_config_config)
    {
        editConfig();
    }

    // config - config - domain
    if(page_config_config_domain)
    {
        editConfigConfigDomain();
    }
    // config - config - proxy
    if(page_config_config_proxy)
    {
        editConfigConfigProxy();
    }
    // config - device
    if(page_config_device)
    {
        editConfig();

        // wait till dynamic content is loaded
        waitForKeyElements ('table#database_redisgroup', editConfigDevice);
    }
    // config - users
    if(page_config_users)
    {
        editConfig();
        editConfigUsers();
    }
    // config - groups
    if(page_config_groups)
    {
        editConfig();
        editConfigGroups();
    }
    // config - access
    if(page_config_access)
    {
        editConfig();
    }
    // config - grids
    if(page_config_grids)
    {
        editConfig();
        editConfigGrids();
    }
    // config - sources
    if(page_config_sources)
    {
        editConfig();
        editConfigSources();
    }
    // config - actions
    if(page_config_actions)
    {
        editConfig();
        editConfigActions();
    }
    // config - menus
    if(page_config_menus)
    {
        editConfig();
        editConfigMenus();
    }
    // config - session
    if(page_config_sessions)
    {
        editConfig();
        editConfigSessions();
    }


    // PAGES SUPPORT

    // support
    if(page_support)
    {
        editSupport();
    }


    // PAGES APITOOL

    // apitool api pages
    if(page_apitool_api_triggers || page_apitool_api_calls || page_apitool_api_conns)
    {
        editApitoolApi();
    }
    // apitool apps
    if(page_apitool_apps)
    {
        editApitoolApps();
    }
    // apitool app login
    if(page_apitool_app_login)
    {
        editApitoolAppLogin();
    }
    // apitool app logout
    if(page_apitool_app_logout)
    {
        editApitoolAppLogout();
    }
    // apitool app reset
    if(page_apitool_app_reset)
    {
        editApitoolAppReset();
    }

    editSaveIcon();
    editTableContentCenterToLeft();
    editTableClickToEdit();
}

// ***********************************************
// Edit base structure
// ***********************************************
function editBaseStructure(name)
{
    // HEADER

    // DeskWall Tools Plus backgrounds
    $('body').append('<div class="dw-tools-info-bg"></div><div class="dw-tools-master-bg"></div><div class="dw-tools-side-bg"></div><div class="dw-tools-debug"></div>');

    // DeskWall Tools Plus logo
    $('body').append('<span class="dw-tools dw-tools-sub dw-tools-plus">'+name+' DeskWall Tools+ <i class="fal fa-code-branch"></i> v'+GM_info.script.version+'</span>');

    // DeskWall Tools Plus configuration
    /*
    var el_configplus = ' <a href="#" class="gm_config_open"><i class="fal fa-cog"></i></a> ';
    $('body span.dw-tools-plus').append(el_configplus);
    */

    // DeskWall Tools tool + desk
    var dw_info = '';

    // tool
    var page_url = window.location.href;

    var page_login = page_url.indexOf('/login') >= 0 && page_url.indexOf('/login_ad') == -1;
    var tool_config = page_url.indexOf('/deskwall/') >= 0 && page_url.indexOf('/apimanager/') == -1;
    var tool_api = page_url.indexOf('/apimanager/') >= 0 || page_url.indexOf('/conectorapp') >= 0;
    var tool_support = page_url.indexOf('/support/') >= 0;
    var tool_remote = page_url.indexOf('/remote/') >= 0;

    // tool name
    var tool_name = '';
    var tool_name_short = '';

    if(tool_config)
    {
        tool_name = '<i class="fal fa-wrench"></i> Config Tool';
        tool_name_short = 'Config Tool';
    }
    else if (tool_api)
    {
        tool_name = '<i class="fal fa-infinity"></i> API Tool';
        tool_name_short = 'API Tool';
    }
    else if (tool_support)
    {
        tool_name = '<i class="fal fa-cogs"></i> Support Tool';
        tool_name_short = 'Support Tool';
    }
    else if (tool_remote)
    {
        tool_name = '<i class="fal fa-paper-plane"></i> Remote Control';
        tool_name_short = 'Remote Control';
    }

    dw_info += tool_name;

    // desk ip
    var desk_ip = window.location.hostname;

    dw_info += ' &nbsp;&nbsp;&nbsp; <i class="fal fa-network-wired"></i> '+desk_ip;

    // desk name
    var desk_name = ' &nbsp;&nbsp;&nbsp; <i class="fal fa-hdd"></i> ';
    var desk_name_short = '';

    if(dw_desks[desk_ip] !== undefined)
    {
        desk_name += '<b>'+dw_desks[desk_ip][0]+'</b>';
        desk_name_short = dw_desks[desk_ip][0];
        if(dw_desks[desk_ip][2])
        {
            desk_name += ' '+dw_desks[desk_ip][2];
        }

        if(tool_config || tool_support)
        {
            desk_name += '<span class="custom-tag-role custom-tag-role-sentinel">?</span>';
            desk_name += '<span class="custom-tag-role custom-tag-role-master d-none">Master</span>';
            desk_name += '<span class="custom-tag-role custom-tag-role-replica d-none">Slave</span>';
        }

        if(dw_desks[desk_ip][1])
        {
            desk_name += ' &nbsp;&nbsp;&nbsp; <i class="fal fa-database"></i> '+dw_desks[desk_ip][1];

        }

        if(tool_config || tool_support)
        {
            desk_name += ' &nbsp;&nbsp;&nbsp; <span class="text-secondary" id="dw-tools-user-color"><i class="fas fa-user" id="dw-tools-user-icon"></i> <span id="dw-tools-user-info">Unknown</span></span>';
        }

        if(tool_config)
        {
            desk_name += ' <a href="https://'+desk_ip+':54381/support/supservices" title="Open '+dw_desks[desk_ip][0]+' Support Tool"><i class="fal fa-cogs"></i> Support Tool</a>'
        }
        else if (tool_support)
        {
            desk_name += ' <a href="https://'+desk_ip+':54318/deskwall/device" title="Open '+dw_desks[desk_ip][0]+' Config Tool"><i class="fal fa-wrench"></i> Config Tool</a>';
        }

        // change title of page
        $(document).prop('title', dw_desks[desk_ip][0] + ' | ' + $(document).prop('title'));
    }
    else
    {
        desk_name += 'Unknown';
    }

    dw_info += ' '+desk_name;


    // DeskWall Tools master information
    var dw_info_master = '';

    if((tool_config || tool_support) && !page_login)
    {
        dw_info_master += ' <i class="fal fa-chart-network" title="Master"></i> <span id="dw-tools-system-master"><i class="fal fa-sync" style="animation: spin 1s linear infinite;"></i></span>';

        dw_info_master = '<span class="dw-tools dw-tools-sub dw-tools-master">' + dw_info_master + '</span>';
    }


    // DeskWall Tools system information
    var dw_info_system = '';

    if(tool_config && !page_login)
    {
        dw_info_system += ' <i class="far fa-clock" title="Uptime"></i> <span id="dw-tools-system-uptime"><i class="fal fa-sync" style="animation: spin 1s linear infinite;"></i></span>';
        dw_info_system += ' &nbsp;&nbsp;&nbsp;';
        dw_info_system += ' <i class="fas fa-memory" title="RAM"></i> <span id="dw-tools-system-ram"><i class="fal fa-sync" style="animation: spin 1s linear infinite;"></i></span>';
        dw_info_system += ' &nbsp;&nbsp;&nbsp;';
        dw_info_system += ' <i class="fas fa-microchip" title="Load Average"></i> <span id="dw-tools-system-load"><i class="fal fa-sync" style="animation: spin 1s linear infinite;"></i></span>';
        dw_info_system += ' &nbsp;&nbsp;&nbsp;';
        dw_info_system += ' <i class="far fa-hdd" title="Storage"></i> <span id="dw-tools-system-storage"><i class="fal fa-sync" style="animation: spin 1s linear infinite;"></i></span>';
        dw_info_system += ' &nbsp;&nbsp;&nbsp;';
        dw_info_system += ' <i class="fal fa-code-branch" title="Versie"></i> <span id="dw-tools-system-version"><i class="fal fa-sync" style="animation: spin 1s linear infinite;"></i></span>';

        dw_info_system = '<span class="dw-tools dw-tools-system">' + dw_info_system + '</span>';
    }

    // DeskWall Tools vnc information
    var dw_info_vnc = '';

    if(tool_support && !page_login)
    {
        dw_info_vnc += '<div class="btn btn-control d-none" id="pathToVnc" data-path="" title="Kopieer VNC naar '+desk_name_short+'"><i class="fas fa-2x fa-copy"></i></div>';

        $('#openWithVnc').before(dw_info_vnc);
    }



    // add information to page
    var el_tool = '<span class="dw-tools dw-tools-tool">'+dw_info+'</span>'+dw_info_master+dw_info_system+dw_info_vnc;

    $('body').append(el_tool);


    // FIELDSETS

    $('body').on('click', 'fieldset.fieldset legend button.btn', function(){

        if($(this).attr('aria-expanded') == "false")
        {
            //$(this).find('svg').css({'transform': 'rotate(45deg)'});
            $(this).find('svg').removeClass('fa-plus').addClass('fa-minus');
        }
        else
        {
            //$(this).find('svg').css({'transform': 'rotate(0deg)'});
            $(this).find('svg').removeClass('fa-minus').addClass('fa-plus');
        }
    });


    // HEADER BUTTONS

    $('div#btn_logout').attr('title', 'Uitloggen uit '+tool_name_short);
    $('div#btn_reset').attr('title', 'Reboot '+desk_name_short);
    $('div#btn_reboot').attr('title', 'Reboot '+desk_name_short);
    $('div#btn_downloadDB').attr('title', 'Download database van '+desk_name_short);
    $('div#btn_restoreDB').attr('title', 'Restore database op '+desk_name_short);
    $('div#openWithVnc').attr('title', 'Initialiseer VNC naar '+desk_name_short);
    $('div#closeWithVnc').attr('title', 'Sluit VNC naar '+desk_name_short);


    // USER INFORMATION
    if(tool_config || tool_support)
    {
        editBaseUser(desk_ip, tool_config, tool_support);
    }
    if(tool_api)
    {
        $('body div#btn_reset, body div#btn_reboot').css('background-color', '#DC3545CC');
    }
}
function editBaseUser(id, config_tool, support_tool)
{
    var page_url = window.location.href;
    var page_login = page_url.indexOf('/login') >= 0 && page_url.indexOf('/login_ad') == -1;

    $('#dw-tools-user-info').html('Checking <i class="fal fa-sync" style="animation: spin 1s linear infinite;"></i>');


    var desk_ip = window.location.hostname;
    var api_url = '/api/dwinfo';
    var process_logged;

    if(page_login)
    {
        // no login = no information
        $('#dw-tools-user-info').html('Login <i class="fas fa-level-down-alt"></i>');
    }

    else if(config_tool)
    {
        api_url = 'https://'+id+':54318/api/dwinfo';

        const obj = {
            id
        }

        $.ajax({
            method: 'POST',
            url: api_url,
            xhrFields: { withCredentials: true },
            contentType: 'json',
            data: JSON.stringify(obj),
            success: function(data, textStatus, jqXHR) {

                try
                {
                    var dataObject = JSON.parse(data);
                    var deskwallInfo = (typeof dataObject === 'string') ? JSON.parse(dataObject) : dataObject;

                    if (Array.isArray(dataObject) && dataObject.length > 0) {
                        dataObject.some(item => {
                            const itemObject = (typeof item === 'string') ? JSON.parse(item) : item;
                            if (itemObject && itemObject.id === id) {
                                deskwallInfo = itemObject;
                            }
                        });
                    }

                    if (deskwallInfo && deskwallInfo.response) {
                        var response = JSON.parse(deskwallInfo.response);

                        // device process with user information
                        var process_logged = response.processes.filter(item => item.cmd === 'logged');

                        // process user information
                        editBaseUserUpdate(process_logged);

                        // debug
                        //console.log(response);

                        // system: uptime
                        if(response.uptime !== undefined)
                        {
                            var reboottime = new Date(Date.now() - (response.uptime * 1000));

                            var uptime = '';
                            var uptime_warning = '';

                            var diff_days = response.uptime / (60*60*24);
                            var diff = new moment.duration(response.uptime * 1000);

                            var uptime_years = Math.floor(diff.years());
                            var uptime_months = Math.floor(diff.months());
                            var uptime_days = Math.floor(diff.days());
                            var uptime_hours = Math.floor(diff.hours());
                            var uptime_minutes = Math.floor(diff.minutes());


                            if(uptime_years > 0)
                            {
                                uptime += uptime_years+' year(s) ';
                            }
                            if(uptime_months > 0)
                            {
                                uptime += uptime_months+' month(s) ';
                            }
                            if(uptime_days > 0)
                            {
                                uptime += uptime_days+' day(s) ';
                            }
                            if(uptime.length == 0)
                            {
                                uptime += String(uptime_hours).padStart(2, '0')+'h '+String(uptime_minutes).padStart(2, '0')+'m ';
                            }

                            if(diff_days < 0.05)
                            {
                                uptime_warning = ' <i class="far fa-redo text-warning"></i>';
                            }
                            else if(diff_days < 1)
                            {
                                uptime_warning = ' <i class="far fa-check-circle text-success"></i>';
                            }
                            else if(diff_days <= 7)
                            {
                                uptime_warning = ' <i class="far fa-check-circle"></i>';
                            }
                            else if(diff_days <= 14)
                            {
                                uptime_warning = ' <i class="far fa-exclamation-circle text-warning"></i>';
                            }
                            else if(diff_days <= 60)
                            {
                                uptime_warning = ' <i class="far fa-exclamation-circle text-danger"></i>';
                            }
                            else
                            {
                                uptime_warning = ' <i class="far fa-exclamation-triangle text-danger"></i>';
                            }

                            $('#dw-tools-system-uptime').html(uptime+uptime_warning).attr('title', 'Last reboot: '+reboottime);
                        }
                        else
                        {
                            $('#dw-tools-system-uptime').html('<i class="fas fa-times"></i>');
                        }

                        // system: ram
                        if(response.ramusage !== undefined)
                        {
                            var ram_usage = '';

                            ram_usage = response.ramusage;

                            $('#dw-tools-system-ram').html(ram_usage);

                            if(response.totalmem !== undefined)
                            {
                                $('span.dw-tools-system svg.fa-memory title').text('RAM ('+(response.totalmem/1073741824).toFixed(1)+' GB total)');
                            }
                        }
                        else
                        {
                            $('#dw-tools-system-ram').html('<i class="fas fa-times"></i>');
                        }

                        // system: load
                        if(response.load !== undefined && response.load.length == 3)
                        {
                            var load = '';
                            var cpus = 1;

                            if(response.cpus !== undefined)
                            {
                                cpus = response.cpus.length;
                            }

                            load += '<span title="Last 1 minute">'+(response.load[0]).toFixed(2);
                            load += ' <span class="text-secondary">'+(response.load[0] / cpus * 100).toFixed(1)+'%</span>';
                            load += '</span>';
                            load += ' <span class="text-secondary">|</span> ';
                            load += '<span title="Last 5 minutes">'+(response.load[1]).toFixed(2);
                            load += ' <span class="text-secondary">'+(response.load[1] / cpus * 100).toFixed(1)+'%</span>';
                            load += '</span>';
                            load += ' <span class="text-secondary">|</span> ';
                            load += '<span title="Last 15 minutes">'+(response.load[2]).toFixed(2);
                            load += ' <span class="text-secondary">'+(response.load[2] / cpus * 100).toFixed(1)+'%</span>';
                            load += '</span>';

                            $('#dw-tools-system-load').html(load);
                        }
                        else
                        {
                            $('#dw-tools-system-load').html('<i class="fas fa-times"></i>');
                        }

                        // system: storage
                        if(response.storage !== undefined && response.storage.length >= 8)
                        {
                            var storage = '';

                            storage += '<span class="text-secondary" title="'+response.storage[0].path+' - '+response.storage[0].avail+' available">'+response.storage[0].used+'</span>';
                            storage += ' <span class="text-secondary">|</span> ';
                            storage += '<span class="text-secondary" title="'+response.storage[1].path+' - '+response.storage[1].avail+' available">'+response.storage[1].used+'</span>';
                            storage += ' <span class="text-secondary">|</span> ';
                            storage += '<span class="" title="'+response.storage[2].path+' - '+response.storage[2].avail+' available">'+response.storage[2].used+'</span>';

                            $('#dw-tools-system-storage').html(storage);
                        }
                        else
                        {
                            $('#dw-tools-system-storage').html('<i class="fas fa-times"></i>');
                        }

                        // system: version
                        if(response.dwversion !== undefined)
                        {
                            var version = '';

                            version = response.dwversion;

                            $('#dw-tools-system-version').html(version);
                        }
                        else
                        {
                            $('#dw-tools-system-version').html('<i class="fas fa-times"></i>');
                        }
                    }
                }
                catch(err)
                {
                    // no login = no information
                    $('#dw-tools-user-info').html('Login <i class="fas fa-level-down-alt"></i>');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {},
            complete: function(jqXHR, textStatus) {}
        });


        $('.dw-tools-debug').addClass('d-none');

        api_url = 'https://'+id+':54318/api/device';

        $.ajax({
            method: 'POST',
            url: api_url,
            xhrFields: { withCredentials: true },
            contentType: 'json',
            data: JSON.stringify(obj),
            success: function(data, textStatus, jqXHR) {

                try
                {
                    var dataObject = JSON.parse(data);

                    // debug
                    console.log(dataObject);

                    if(Object.keys(dataObject).length > 0)
                    {
                        // role
                        if(dataObject.database.redisrole !== undefined)
                        {
                            var role = dataObject.database.redisrole;

                            switch(role)
                            {
                                case 'master':
                                    $('span.dw-tools-tool span.custom-tag-role-sentinel').addClass('d-none');
                                    $('span.dw-tools-tool span.custom-tag-role-master').removeClass('d-none');
                                    break;
                                case 'slave':
                                    $('span.dw-tools-tool span.custom-tag-role-sentinel').addClass('d-none');
                                    $('span.dw-tools-tool span.custom-tag-role-replica').removeClass('d-none');
                                    break;
                            }
                        }


                        // master
                        if(dataObject.sentinelMyMaster !== undefined && dataObject.sentinelMyMaster != '')
                        {
                            var master = '';
                            var master_ip = dataObject.sentinelMyMaster;
                            var master_itsame = false;

                            master = '<span class="custom-tag-role custom-tag-role-master">Master of this group</span> ' + master_ip;

                            if(dw_desks[master_ip] !== undefined && dw_desks[master_ip][0] !== undefined)
                            {
                                master += ' <b>'+dw_desks[master_ip][0]+'</b>';
                            }
                            else
                            {
                                master += ' <b>UNKNOWN</b>';
                            }

                            if(desk_ip == master_ip)
                            {
                                master += '<span class="custom-tag-role custom-tag-role-master">Me</span>';
                                master += '<span class="custom-tag-role custom-tag-role-master">You are currently logged in to a master!</span>';

                                $('div.dw-tools-info-bg').css('border-color', 'green').css('border-width', '6px');
                                $('div.dw-tools-side-bg').addClass('dw-tools-side-bg-master');
                                $('div.dw-tools-master-bg').addClass('dw-tools-master-bg-master');

                                master_itsame = true;
                            }
                            else
                            {
                                master += '<span class="custom-tag-role custom-tag-role-replica">Not me</span>';
                                master += '<a class="" href="https://'+master_ip+':54318/deskwall/device" title="Open Master Config Tool"><i class="fal fa-wrench"></i> Open Master Config Tool to edit global group settings</a>';

                                $('div.dw-tools-info-bg').css('border-color', 'rgb(220, 53, 69)').css('border-width', '6px');
                                $('div.dw-tools-side-bg').addClass('dw-tools-side-bg-slave');
                                $('div.dw-tools-master-bg').addClass('dw-tools-master-bg-slave');

                                $('body').addClass('imaslave');
                            }

                            $('#dw-tools-system-master').html(master);

                            if(master_itsame)
                            {
                                $('span#dw-tools-system-master span.custom-tag-role-master').addClass('custom-tag-role-master-itsame');
                            }
                        }
                        else
                        {
                            $('#dw-tools-system-master').html('<i class="fas fa-times"></i>');
                        }

                        // system
                        if(dataObject.system !== undefined)
                        {
                            var debug = '<span class="text-white"><i class="far fa-check"></i></span>';
                            var debug_class = 'bg-success';

                            var debug_show = new Array();

                            var months = {jan: "Jan", feb: "Feb", mrt: "Mar", apr: "Apr", mei: "May", jun: "Jun", jul: "Jul", aug: "Aug", sep: "Sep", okt: "Oct", nov: "Nov", dec: "Dec"};


                            // domain
                            if(dataObject.identification.domain !== undefined)
                            {
                                if(dataObject.identification.domain != 'politie.local')
                                {
                                    debug_show.push('<span class="text-white"><i class="far fa-times-circle"></i> '+dataObject.identification.domain);
                                }
                            }

                            // datetime
                            if(dataObject.system.datetime !== undefined)
                            {
                                var dw_system_date_string = dataObject.system.datetime;
                                var dw_system_date_timestamp = 0;
                                var dw_host_date_timestamp = Date.now();

                                // remove day, CEST and translate month from NL to EN
                                dw_system_date_string = dw_system_date_string.substring(3, dw_system_date_string.length - 5);
                                dw_system_date_string = dw_system_date_string.replace(/jan|feb|mrt|apr|mei|jun|jul|aug|sep|okt|nov|dec/gi, function(match){
                                    return months[match];
                                });

                                dw_system_date_timestamp = Date.parse(dw_system_date_string);

                                if(parseInt(dw_host_date_timestamp - dw_system_date_timestamp, 0) > 60000)
                                {
                                    debug_show.push('<span class="text-white"><i class="far fa-times-circle"></i> '+dataObject.system.datetime);
                                }
                            }

                            // locale
                            if(dataObject.system.locale !== undefined)
                            {
                                if(dataObject.system.locale != 'nl_BE.UTF-8')
                                {
                                    debug_show.push('<span class="text-white"><i class="far fa-times-circle"></i> '+dataObject.system.locale);
                                }
                            }

                            // ctl
                            if(dataObject.system.timedatectl !== undefined)
                            {
                                if(dataObject.system.timedatectl != 'Europe/Brussels')
                                {
                                    debug_show.push('<span class="text-white"><i class="far fa-times-circle"></i> '+dataObject.system.timedatectl);
                                }
                            }

                            if(debug_show.length > 0)
                            {
                                debug = debug_show.join('<br>');
                                debug_class = 'bg-danger';

                                $('.dw-tools-debug').html(debug).addClass(debug_class).removeClass('d-none');
                            }
                        }
                    }
                }
                catch(err)
                {

                }
            },
            error: function(jqXHR, textStatus, errorThrown) {},
            complete: function(jqXHR, textStatus) {}
        });

    }

    else if (support_tool)
    {
        api_url = 'https://'+id+':54381/support/action';

        // user
        var process_user_information = true;

        socket.on('binary/list/res', function(data) {

            if(process_user_information)
            {
                var deskwallInfo = data;

                if (Array.isArray(deskwallInfo) && deskwallInfo.length > 0) {

                    // debug
                    //console.log(deskwallInfo);

                    // device process with user information
                    var process_logged = deskwallInfo.filter(item => item.pname === 'logged.js');

                    // process user information
                    editBaseUserUpdate(process_logged);
                }

                // don't check again
                process_user_information = false;
            }
        });

        $.ajax({
            method: 'POST',
            url: api_url,
            xhrFields: { withCredentials: true },
            contentType: 'application/json',
            data: JSON.stringify(['binary/list','']),
            success: function(data, textStatus, jqXHR) {},
            complete: function(jqXHR, textStatus) {}
        });


        // role
        var process_role_information = true;

        socket.on('db/info/res', function(data) {

            if(process_role_information)
            {
                if(data.role){
                    var role = data.role;

                    switch(role)
                    {
                        case 'master':
                            $('span.dw-tools-tool span.custom-tag-role-sentinel').addClass('d-none');
                            $('span.dw-tools-tool span.custom-tag-role-master').removeClass('d-none');
                            break;
                        case 'slave':
                            $('span.dw-tools-tool span.custom-tag-role-sentinel').addClass('d-none');
                            $('span.dw-tools-tool span.custom-tag-role-replica').removeClass('d-none');
                            break;
                    }

                    // don't check again
                    process_role_information = false;
                }
            }
        });

        $.ajax({
            method: 'POST',
            url: api_url,
            xhrFields: { withCredentials: true },
            contentType: 'application/json',
            data: JSON.stringify(['db/info', '']),
            success: function(data, textStatus, jqXHR) {},
            complete: function(jqXHR, textStatus) {}
        })


        // master
        var process_master_information = true;

        socket.on('service/config/res', function(data) {

            if(process_master_information)
            {
                if(data.id === 'redis-server' && data.config !== undefined)
                {
                    var config = data.config.toString();
                    var config_array = config.split("\n");

                    var master_info = '';
                    var master_itsame = false;

                    for (var i = 0; i < config_array.length; i++)
                    {
                        var line = config_array[i];

                        if(line.indexOf('replicaof') != -1)
                        {
                            master_info = line;
                        }
                    }


                    var master = '';
                    var master_ip = '';

                    if(master_info != '')
                    {
                        // desk is slave
                        master_ip = master_info.split(' ')[1];
                    }
                    else
                    {
                        // desk is master
                        master_ip = desk_ip;
                    }


                    master = '<span class="custom-tag-role custom-tag-role-master">Master of this group</span> ' + master_ip;

                    if(dw_desks[master_ip] !== undefined && dw_desks[master_ip][0] !== undefined)
                    {
                        master += ' <b>'+dw_desks[master_ip][0]+'</b>';
                    }
                    else
                    {
                        master += ' <b>UNKNOWN</b>';
                    }

                    if(desk_ip == master_ip)
                    {
                        master += '<span class="custom-tag-role custom-tag-role-master">Me</span>';
                        master += '<span class="custom-tag-role custom-tag-role-master">You are currently logged in to a master!</span>';

                        $('div.dw-tools-info-bg').css('border-color', 'green').css('border-width', '6px');
                        $('div.dw-tools-side-bg').addClass('dw-tools-side-bg-master');
                        $('div.dw-tools-master-bg').addClass('dw-tools-master-bg-master');

                        master_itsame = true;
                    }
                    else
                    {
                        master += '<span class="custom-tag-role custom-tag-role-replica">Not me</span>';
                        master += '<a class="" href="https://'+master_ip+':54381/support/supservices" title="Open Master Support Tool"><i class="fal fa-cogs"></i> Master Support Tool</a>';

                        $('div.dw-tools-info-bg').css('border-color', 'rgb(220, 53, 69)').css('border-width', '6px');
                        $('div.dw-tools-side-bg').addClass('dw-tools-side-bg-slave');
                        $('div.dw-tools-master-bg').addClass('dw-tools-master-bg-slave');

                        $('body').addClass('imaslave');
                    }

                    $('#dw-tools-system-master').html(master);

                    if(master_itsame)
                    {
                        $('span#dw-tools-system-master span.custom-tag-role-master').addClass('custom-tag-role-master-itsame');
                    }

                    process_master_information = false;
                }
                else
                {
                    $('#dw-tools-system-master').html('<i class="fas fa-times"></i>');
                }
            }

        });

        $.ajax({
            method: 'POST',
            url: api_url,
            xhrFields: { withCredentials: true },
            contentType: 'application/json',
            data: JSON.stringify(['service/redis-server/config/read', '']),
            success: function(data, textStatus, jqXHR) {},
            complete: function(jqXHR, textStatus) {}
        })


        // vnc
        socket.on('vnc/status/res', function(msg) {
            if(msg.isSharing === false)
            {
                $('#pathToVnc').addClass('d-none');
            }
        });

        socket.on('vnc/tunnel/res', function(msg) {
            if(msg && msg.port && msg.path)
            {
                $('#pathToVnc').attr('data-path', window.location.hostname+"::"+msg.port);
                $('#pathToVnc').removeClass('d-none');

                $('#pathToVnc').on('click', function(){
                    var $temp = $("<textarea>");
                    $(this).parent().append($temp);
                    $temp.val(window.location.hostname+"::"+msg.port).select();
                    document.execCommand("copy");
                    $temp.remove();
                });
            }
        });
    }
}
function editBaseUserUpdate(process)
{
    if(Array.isArray(process) && process.length === 1)
    {
        // get user number
        var user_number = process[0].user;
        var user_name = 'Unknown';


        // get user icon informatien
        var user_icon = getDwUserIcon(user_number);

        var user_icon_type = user_icon[0];
        var user_icon_name = user_icon[1];

        if(dw_users[user_number] !== undefined)
        {
            user_name = dw_users[user_number][0];
        }

        var user_style_icon = '<i class="fal fa-'+user_icon_type+' custom-icon-user" title="'+user_icon_name+'"></i> ';

        $('#dw-tools-user-color').addClass('text-warning');
        $('#dw-tools-user-icon').removeClass('fas fa-user');
        $('#dw-tools-user-info').html(user_number+' &nbsp; '+user_style_icon+' '+user_name);

        $('body div#btn_reset, body div#btn_reboot').css('background-color', '#DC3545CC');
    }
    else
    {
        // no user logged in
        $('#dw-tools-user-color').addClass('text-success');
        $('#dw-tools-user-icon').removeClass('fas fa-user').addClass('fal fa-user');
        $('#dw-tools-user-info').text('Free');
    }
}

// ***********************************************
// Edit base CSS
// ***********************************************
function editBaseCSS()
{
    var page_url = window.location.href;

    var page_login = page_url.indexOf('/login') >= 0 && page_url.indexOf('/login_ad') == -1;
    var page_config_users = page_url.indexOf('/deskwall/users') >= 0;
    var page_config_groups = page_url.indexOf('/deskwall/groups') >= 0;
    var page_config_grids = page_url.indexOf('/deskwall/grids') >= 0;
    var page_config_sources = page_url.indexOf('/deskwall/apps') >= 0;
    var page_config_actions = page_url.indexOf('/deskwall/actions') >= 0;
    var page_config_menus = page_url.indexOf('/deskwall/menus') >= 0;
    var page_config_sessions = page_url.indexOf('/deskwall/session') >= 0;

    // PAGE

    // body
    GM_addStyle('body { margin-top: 59px; }');
    GM_addStyle('body header { padding-top: 0; }');
    GM_addStyle('body header div.header-dw-config { padding-bottom: 0; }');
    GM_addStyle('body div.dw-tools-info-bg { z-index: 900; background-color: rgba(65, 65, 65, 1); position: fixed; top: 0px; left: 0px; height: 34px; width: 100%; border-bottom: 1px solid #36B1B9; }');
    GM_addStyle('body div.dw-tools-side-bg { z-index: 900; background-color: rgba(65, 65, 65, 1); position: fixed; top: 33px; left: 0px; width: 6px; height: 100%;}');
    GM_addStyle('body div.dw-tools-side-bg.dw-tools-side-bg-master { background-color: rgba(0, 128, 0, 1); }');
    GM_addStyle('body div.dw-tools-side-bg.dw-tools-side-bg-slave { background-color: rgba(220, 53, 69, 1); }');
    GM_addStyle('body div.dw-tools-master-bg { z-index: 800; background-color: rgba(65, 65, 65, 1); position: absolute; top: 34px; left: 0px; height: 25px; width: 100%; }');
    GM_addStyle('body div.dw-tools-master-bg.dw-tools-master-bg-master { background-color: rgba(0, 128, 0, 1); }');
    GM_addStyle('body div.dw-tools-master-bg.dw-tools-master-bg-slave { background-color: rgba(220, 53, 69, 1); }');
    GM_addStyle('body div.dw-tools-debug { background-color: rgba(65, 65, 65, 0.9); padding: 5px 10px; position: fixed; right: 10px; bottom: 10px; border-radius: 5px; color: #DDDDDD; font-size: 11px; }');

    GM_addStyle('body span.dw-tools { font-size: 13px; color: #36B1B9; }');
    GM_addStyle('body span.dw-tools.dw-tools-sub { font-size: 11px; color: #EEEEEE; }');
    GM_addStyle('body span.dw-tools a { margin-left: 20px; color: #666666; }');
    GM_addStyle('body span.dw-tools a:hover { color: #CCCCCC; }');
    GM_addStyle('body span#dw-tools-system-master a { margin-left: 20px; color: #CCCCCC; }');
    GM_addStyle('body span#dw-tools-system-master a:hover { color: #EEEEEE; }');
    GM_addStyle('body span.dw-tools span.custom-tag-role { margin-left: 5px; padding: 0px 4px 0px 4px; }');
    GM_addStyle('body span.dw-tools span.custom-tag-role-master.custom-tag-role-master-itsame { background-color: #EEEEEE; color: green; }');
    //GM_addStyle('body span.dw-tools a { font-size: 11px; background-color: #36B1B9; color: #FFFFFF; padding: 1px 5px; border-radius: 5px; display: inline-block; vertical-align: top; margin: 1px 0px 0px 5px; }');
    //GM_addStyle('body span.dw-tools a:hover { background-color: #CCCCCC; }');

    GM_addStyle('body span.dw-tools-tool { z-index: 901; text-align: left; position: fixed; left: 10px; top: 5px; }');
    GM_addStyle('body span.dw-tools-system { z-index: 901; text-align: left; position: fixed; right: 10px; top: 5px; }');
    GM_addStyle('body span.dw-tools-plus {  z-index: 801; text-align: right; position: absolute; right: 10px; top: 36px; }');
    GM_addStyle('body span.dw-tools-master { z-index: 801; text-align: center; position: absolute; left: 0px; top: 36px; width: 100%; }');
    GM_addStyle('body span.dw-tools-vnc { text-align: left; position: absolute; right: 40px; top: 28px; border-radius: 5px 5px 5px 5px; padding: 2px 15px 2px 15px; }');

    GM_addStyle('body div#btn_logout { background-color: #14B5BDCC; margin-left: 25px; }');
    GM_addStyle('body div#btn_reset, body div#btn_reboot { background-color: #FFC107CC;  margin-left: 5px; }');
    GM_addStyle('body div#btn_downloadDB { background-color: #333333CC; margin-left: 25px; }');
    GM_addStyle('body div#btn_restoreDB { background-color: #333333CC; margin-left: 5px; }');
    GM_addStyle('body div#openWithVnc { background-color: #333333CC; }');
    GM_addStyle('body div#closeWithVnc { background-color: #28A745CC; }');
    GM_addStyle('body div#pathToVnc { background-color: #14B5BDCC; margin-right: 5px; }');

    GM_addStyle('body div#btn_logout, body div#btn_reset, body div#btn_reboot, body div#openWithVnc, body div#closeWithVnc, body div#pathToVnc, body div#btn_downloadDB, body div#btn_restoreDB { border-radius: 5px; }');
    GM_addStyle('body div#btn_logout:hover, body div#btn_reset:hover, body div#btn_reboot:hover, body div#openWithVnc, body div#pathToVnc:hover, body div#btn_downloadDB:hover, body div#btn_restoreDB:hover { color: #CCCCCC; }');

    GM_addStyle('@keyframes spin { 100% { transform:rotate(360deg); } }');

    // PAGE

    // content
    if(!page_login && !page_config_grids && !page_config_sources && !page_config_actions && !page_config_menus && !page_config_sessions)
    {
        GM_addStyle('article div.container { max-width: 100% !important; }');
        GM_addStyle('article fieldset.container { max-width: 100% !important; }');
    }

    // desks and users
    GM_addStyle('body .custom-desk-links { display: block; }');

    GM_addStyle('body .custom-form-half { margin-right: 1rem; width: 45%; display: inline-block; vertical-align: top; }');
    GM_addStyle('body .custom-form-half h6 { padding-left: 5px; margin-top: 1rem; }');
    GM_addStyle('body .custom-form-half p { padding: 1px 5px 1px 5px; margin: 0px 0px 1px 0px; }');
    GM_addStyle('body .custom-form-half p:hover { background-color: #36B1B9; color: white; border-radius: 3px; cursor: hand; }');
    GM_addStyle('body .custom-form-half p span { display: inline-block; }');
    GM_addStyle('body .custom-form-half p span.custom-loginout-value { width: 150px; }');
    GM_addStyle('body .custom-form-half p span.custom-login-desk { width: 120px; }');
    GM_addStyle('body .custom-form-half p span.custom-icon-width { width: 25px; text-align: center; }');
    GM_addStyle('body .custom-form-half p a { padding: 1px 5px; color: #36B1B9; border-radius: 3px; }');
    //GM_addStyle('body .custom-form-half p a:hover { color: #36B1B9; }');
    GM_addStyle('body .custom-form-half p:hover a { color: #FFFFFF; }');
    GM_addStyle('body .custom-form-half p:hover a:hover { background-color: #FFFFFF; color: #36B1B9; }');

    GM_addStyle('body .custom-form-half p.custom-login-desk-current { background-color: #36B1B9; color: white; border-radius: 3px; }');
    GM_addStyle('body .custom-form-half p.custom-login-desk-current a { color: #FFFFFF; }');

    // device - database
    GM_addStyle('body #custom-database-loading { margin-left: 10px; }');
    GM_addStyle('body #custom-database-loading svg { animation: spin 1s linear infinite; }');
    GM_addStyle('body #custom-database-loaded { margin-left: 10px; color: green; }');
    // device - roles
    GM_addStyle('body span.custom-tag-role { margin: 0px 2px 1px 0px; padding: 2px 4px 2px 4px; font-size: 11px; color: #FFFFFF; background-color: #CCCCCC; border-radius: 3px; text-transform: lowercase; font-weight: 300; }');
    GM_addStyle('body span.custom-tag-role-master { background-color: green; }');
    GM_addStyle('body span.custom-tag-role-replica { background-color: #666666; }');
    GM_addStyle('body span.custom-tag-role-sentinel { background-color: #36B1B9; }');
    GM_addStyle('body span.custom-tag-role-me { background-color: orange; }');
    GM_addStyle('body span.custom-tag-role-master-absolute { position: absolute; top: 25px; right: 0px; }');
}

// ***********************************************
// Edit global CSS
// ***********************************************
function editGlobalCSS()
{
    // PAGE
    GM_addStyle('article { padding: 10px 2rem 1rem; }');
    GM_addStyle('#buttons, #item-buttons { margin: 0 1em; }');

    // menu
    GM_addStyle('div.fondo-icono-menu { padding: 0.5em 1em 0em; }');
    GM_addStyle('div.fondo-icono-menu.active { border: 2px solid #79C1C8; border-bottom: none; }');
    GM_addStyle('div.fondo-icono-menu p { margin-bottom: 0.5rem; }');

    // tables
    GM_addStyle('div.table-wrapper { margin: 0 0.25em 1em 0.25em; height: 0px; min-height: 25px; }');

    GM_addStyle('table.dataTable tbody tr, table.dataTable tbody tr:hover { border: none !important; box-shadow: none !important; }');
    GM_addStyle('table.dataTable tbody tr.odd { background-color: #DDDDDD !important; }');
    GM_addStyle('table.dataTable tbody tr.row-selected.odd td { background-color: #E6F7E6 !important; }');
    GM_addStyle('table.dataTable tbody tr.row-selected.even td { background-color: #DBEBDB !important; }');
    GM_addStyle('table.dataTable tbody tr.odd:hover, table.dataTable tbody tr.even:hover { background-color: #F0F0F0 !important; }');
    GM_addStyle('table.dataTable tbody tr.odd.row-selected:hover td, table.dataTable tbody tr.even.row-selected:hover td { background-color: #CEE1CE !important; }');

    GM_addStyle('table.dataTable tbody tr td, table.dataTable tbody tr:hover td, table.dataTable tbody tr.row-selected td, table.dataTable tbody tr.row-selected:hover td { border: none !important; border-bottom: 1px solid #FFFFFF !important; }');

    GM_addStyle('.table td, .table th { padding: .35rem .50rem; }');

    GM_addStyle('.container #item-buttons button.btn.btn-success { background-color: #28a745 !important; border-color: #28a745 !important; color: #ffffff !important; }');
    GM_addStyle('.container #item-buttons button.btn.btn-danger { background-color: #dc3545 !important; border-color: #dc3545 !important; color: #ffffff !important; }');
    GM_addStyle('.container #item-buttons button.btn.btn-success [data-prefix="fal"] { color: #ffffff !important; }');
    GM_addStyle('.container #item-buttons button.btn.btn-danger [data-prefix="fal"] { color: #ffffff !important; }');
    GM_addStyle('.container #item-buttons button.btn.btn-success:hover { background-color: #218838 !important; border-color: #1e7e34 !important; color: #ffffff !important; }');
    GM_addStyle('.container #item-buttons button.btn.btn-danger:hover { background-color: #c82333 !important; border-color: #bd2130 !important; color: #ffffff !important; }');

    GM_addStyle('.container .btn-group button.btn.btn-secondary.disabled { background-color: #6c757d !important; color: #fff !important; margin-right: 0px !important; }');

    GM_addStyle('table#database_redisgroup { font-size: 0.9rem !important; }');

    // forms
    GM_addStyle('legend { margin: 0 0 0 50px; padding: 0.5em 1em; }');
    GM_addStyle('fieldset { padding: 0 1em 0.25em 1em0; margin: 0px; min-height: 70px; border-radius: 10px; }');
    GM_addStyle('fieldset#response { background-color: #36B1B9; border-radius: 5px; color: #FFFFFF; }');
    GM_addStyle('div.form-group { margin-bottom: 0.25rem; }');
    GM_addStyle('div.form-group div.dt-buttons.btn-group button.btn.btn-secondary { margin-right: 5px; border-radius: 0.25rem !important; }');
    GM_addStyle('label.row { margin: 0; }');
    GM_addStyle('textarea { padding: .375rem .75rem; border: 1px solid #ced4da; border-radius: 0.25rem; color: rgb(77,77,77); transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out; }');


    // DEVICES

    // custom
    GM_addStyle('body span.custom-tag-state-active { background-color: green; }');
    GM_addStyle('body span.custom-tag-state-inactive { background-color: red; }');

    GM_addStyle('body span.custom-tag-license { margin: 0px 2px 1px 0px; padding: 2px 4px 2px 4px; font-size: 11px; color: #FFFFFF; background-color: #CCCCCC; border-radius: 3px; text-transform: lowercase; }');
    GM_addStyle('body span.custom-tag-license-deskwall { background-color: #DDDDDD; color: #666666; }');
    GM_addStyle('body span.custom-tag-license-none { background-color: orange; }');

    GM_addStyle('body .custom-icon-state-online.custom-icon-link { color: gray; }');
    GM_addStyle('body .custom-icon-state-offline.custom-icon-link { color: lightgray; }');
    GM_addStyle('body .custom-icon-state-online.custom-icon-link:hover { color: #00B4BC; }');
    GM_addStyle('body .custom-icon-state-offline.custom-icon-link:hover { color: #00B4BC; }');

    GM_addStyle('body .custom-icon-state-online.custom-icon-user { color: green; }');
    GM_addStyle('body .custom-icon-state-offline.custom-icon-user { color: lightgray; }');
    GM_addStyle('body .custom-icon-state-empty.custom-icon-user { color: lightgray; }');
    GM_addStyle('body .custom-icon-state-special.custom-icon-user { color: orange; }');

    GM_addStyle('body .custom-icon-state-old.custom-icon-version { color: orange; }');
    GM_addStyle('body .custom-icon-state-new.custom-icon-version { color: lightgray; }');

    GM_addStyle('body .custom_desks_reload_all_number { margin-left: 10px; display: inline-block; line-height: 1.1em; text-align: left; }');

    GM_addStyle('body .custom-container-loginout { margin-top: 30px; }');


    // SUPPORT TOOL
    GM_addStyle('body table#support-process-table td.wrap-column:nth-child(1) { width: 200px; }');
    GM_addStyle('body table#support-process-table td:nth-child(2) { width: 100px; }');
    GM_addStyle('body table#support-process-table td:nth-child(3) { width: 100px; }');
    GM_addStyle('body table#support-process-table td:nth-child(4) { width: 100px; }');
    GM_addStyle('body table#support-process-table td.wrap-column:nth-child(5) { width: 300px; }');
    GM_addStyle('body table#support-process-table td.wrap-column:nth-child(6) { width: auto; }');


    // API TOOL
    GM_addStyle('body div#custom-desks div.custom-overflow-hidden { height: 300px; overflow: hidden; overflow-y: scroll; }');
    GM_addStyle('body div#custom-users div.custom-overflow-hidden { height: 300px; overflow: hidden; overflow-y: scroll; }');
}


// ***********************************************
// Edit custom structure
// ***********************************************
function editCustomStructure()
{
    var page_url = window.location.href;

    var page_login = page_url.indexOf('/login') >= 0;
    var page_config_device = page_url.indexOf('/deskwall/device') >= 0 && page_url.indexOf('gotopage') == -1;

    // config - device
    if(page_config_device)
    {
        // move database to top
        editConfigDeviceDatabase();
    }
}

// ***********************************************
// Edit Login page
// ***********************************************
function editPageLogin()
{
    var desk_ip = window.location.hostname;
    var page_url = window.location.href;

    var tool_config = page_url.indexOf('/deskwall/') >= 0 && page_url.indexOf('/apimanager/') == -1;
    var tool_api = page_url.indexOf('/apimanager/') >= 0;
    var tool_support = page_url.indexOf('/support/') >= 0;
    var tool_remote = page_url.indexOf('/remote/') >= 0;

    // focus on input and change text on button
    if(tool_config)
    {
        $('input#username').focus();
        $('button#login').html($('button#login').html()+' to <i class="fal fa-wrench"></i> Config Tool');
    }
    else if(tool_api)
    {
        $('input#username').focus();
        $('button#login').html($('button#login').html()+' to <i class="fal fa-infinity"></i> API Tool');
    }
    else if(tool_support)
    {
        $('input#password').focus();
        $('button#login').html($('button#login').html()+' to <i class="fal fa-cogs"></i> Support Tool');
    }
    else if(tool_remote)
    {
        $('button#login').html($('button#login').html()+' to <i class="fal fa-paper-plane"></i> Remote Control');
    }


    // enter to login
    $(document).on('keypress', function(e){
        if(e.which == 13)
        {
            $('button#login').click();

            return false;
        }
    });


    // List of devices
    // *******************************************
    var html_desks = '';
    var current_desk = '';
    var desk_icon = '';
    var desk_icon_type = '';
    var desk_icon_name = '';

    // find redis groups
    var groups = [];
    var group;

    $.each(dw_desks, function(ip, desk) {
        if(desk[1] !== undefined)
        {
            group = desk[1];

            if(!groups.includes(group))
            {
                groups.push(group);
            }
        }

    });

    // loop groups
    $.each(groups, function(index, group) {
        html_desks += '<div class="form-group custom-form-half">';
        html_desks += '<h6>'+group+'</h6>';

        $.each(dw_desks, function(ip, desk) {
            if(desk[1] !== undefined && desk[1] == group)
            {
                if(desk_ip == ip)
                {
                    current_desk = 'custom-login-desk-current';
                }
                else
                {
                    current_desk = '';
                }

                // get desk icon informatien
                desk_icon = getDwDeskIcon(ip);

                desk_icon_type = desk_icon[0];
                desk_icon_name = desk_icon[1];


                html_desks += '<p class="'+current_desk+'"><span class="custom-login-desk"><span class="custom-icon-width"><i class="fal fa-'+desk_icon_type+'" title="'+desk_icon_name+'"></i></span> '+desk[0]+'</span> <a href="https://'+ip+':54318/deskwall/device"><i class="fal fa-wrench"></i> Config Tool</a> <a href="https://'+ip+':54381/support/supservices"><i class="fal fa-cogs"></i> Support Tool</a></p>';

                if(desk[1] == 'WALLS')
                {
                    html_desks += '<p class="'+current_desk+'"><span class="custom-login-desk"><span class="custom-icon-width"><i class="fal fa-'+desk_icon_type+'" title="'+desk_icon_name+'"></i></span> '+desk[0]+'</span> <a href="https://'+ip+':54318/remote/control"><i class="fal fa-paper-plane"></i> Remote Control</a></p>';
                }
            }
        });

        html_desks += '</div>';
    });

    // API Tool
    var ip_api = '192.168.192.199';

    html_desks += '<div class="form-group custom-form-half">';
    html_desks += '<h6>API</h6>';

    if(desk_ip == ip_api)
    {
        current_desk = 'custom-login-desk-current';
    }
    else
    {
        current_desk = '';
    }

    html_desks += '<p class="'+current_desk+'"><span class="custom-login-desk"><span class="custom-icon-width"><i class="fal fa-dot-circle"></i></span> APITOOL</span> <a href="https://'+ip_api+':54318/deskwall/device"><i class="fal fa-wrench"></i> Config Tool</a> <a href="https://'+ip_api+':54318/apimanager/customtrigger"><i class="fal fa-infinity"></i> API Tool</a></p>';

    html_desks += '</div>';

    $('#article').append('<div class="container"><fieldset class="custom-desk-links"><legend>Desks</legend><div class="form form-horizontal">'+html_desks+'</div></fieldset></div>')
}

// ***********************************************
// CONFIG TOOL
// ***********************************************
function editConfig()
{
    // GLOBAL change button colors
    GM_addStyle('div#article div#buttons button { background-color: #14B5BD !important; color: #FFFFFF !important; margin-right: 5px; }');
    GM_addStyle('div#article div#buttons button svg { color: #FFFFFF !important; }');
    GM_addStyle('div#article div#buttons button:hover { background-color: #27969B !important; }');
    GM_addStyle('div#article div#buttons button:hover svg { color: #CCCCCC !important; }');

    GM_addStyle('div#article div#item-buttons button:not(.btn-success):not(.btn-danger) { background-color: #14B5BD !important; color: #FFFFFF !important; margin-right: 5px; }');
    GM_addStyle('div#article div#item-buttons button:not(.btn-success):not(.btn-danger) svg { color: #FFFFFF !important; }');
    GM_addStyle('div#article div#item-buttons button:not(.btn-success):not(.btn-danger):hover { background-color: #27969B !important; }');
    GM_addStyle('div#article div#item-buttons button:not(.btn-success):not(.btn-danger):hover svg { color: #CCCCCC !important; }');
    GM_addStyle('div#article div#item-buttons button#back { background-color: #41D9DF !important; color: #FFFFFF !important; margin-right: 5px; }');
    GM_addStyle('div#article div#item-buttons button#back:hover { background-color: #27969B !important; }');

    // GLOBAL change buttons colors: DISABLE SLAVE BUTTONS
    if(window.location.href.indexOf('/deskwall/config/domain') == -1)
    {
        GM_addStyle('body.imaslave div#article div#buttons button { background-color: #999999 !important; }');
        GM_addStyle('body.imaslave div#article div#buttons button { background-color: #999999 !important; }');
        GM_addStyle('body.imaslave div#article div#buttons button svg { color: #dc3545 !important; }');
        GM_addStyle('body.imaslave div#article div#buttons button:hover { background-color: #959595 !important; }');

        GM_addStyle('body.imaslave div#article div#item-buttons button { background-color: #999999 !important; }');
        GM_addStyle('body.imaslave div#article div#item-buttons button#back { background-color: #BBBBBB !important; }');
        GM_addStyle('body.imaslave div#article div#item-buttons button svg { color: #dc3545 !important; }');
        GM_addStyle('body.imaslave div#article div#item-buttons button#back svg { color: #FFFFFF !important; }');
        GM_addStyle('body.imaslave div#article div#item-buttons button:hover { background-color: #959595 !important; }');
        GM_addStyle('body.imaslave div#article div#item-buttons button#back:hover { background-color: #959595 !important; }');
    }


    // SPECIFIC change button colors
    GM_addStyle('div#article div#database_redisgroup_wrapper button { background-color: #14B5BD !important; color: #FFFFFF !important; margin-right: 5px; }');
    GM_addStyle('div#article div#database_redisgroup_wrapper button svg { color: #FFFFFF !important; }');
    GM_addStyle('div#article div#database_redisgroup_wrapper button:hover { background-color: #27969B !important; }');
    GM_addStyle('div#article div#database_redisgroup_wrapper button:hover svg { color: #CCCCCC !important; }');

    GM_addStyle('div#article div#deskwall-files button { background-color: #14B5BD !important; color: #FFFFFF !important; margin-right: 5px; }');
    GM_addStyle('div#article div#deskwall-files button svg { color: #FFFFFF !important; }');
    GM_addStyle('div#article div#deskwall-files button:hover { background-color: #27969B !important; }');
    GM_addStyle('div#article div#deskwall-files button:hover svg { color: #CCCCCC !important; }');

    GM_addStyle('div#article div#device-buttons button { background-color: #14B5BD !important; color: #FFFFFF !important; margin-right: 5px; }');
    GM_addStyle('div#article div#device-buttons button svg { color: #FFFFFF !important; }');
    GM_addStyle('div#article div#device-buttons button:hover { background-color: #27969B !important; }');
    GM_addStyle('div#article div#device-buttons button:hover svg { color: #CCCCCC !important; }');
}

// ***********************************************
// Edit Config Tool Global Config Domain Settings
// ***********************************************
function editConfigConfigDomain()
{
    $('.btn-success').each(function(){
        $(this).html($(this).html() + ' Join domain');
    });
    $('.btn-danger').each(function(){
        $(this).html($(this).html() + ' Leave domain');
    });
}

// ***********************************************
// Edit Config Tool Global Config Proxy Settings
// ***********************************************
function editConfigConfigProxy()
{
    var el_proxy_exceptions_input = $('#proxyexceptions');
    var proxy_exceptions = el_proxy_exceptions_input.val().trim();
    var proxy_exceptions_list = proxy_exceptions.split(",");

    var el_proxy_exceptions_textarea = '<div class="btn-toolbar row" role="toolbar" style="justify-content: center;"><button class="btn" id="proxyexception_copy"><i class="fa fa-arrow-up"></i> Kopieer de aangepaste lijst met deze knop opnieuw naar boven alvorens te bewaren</button></div><textarea id="proxyexceptions_list" rows="25" style="width: 100%;">'+proxy_exceptions_list.join("\n")+'</textarea>';

    el_proxy_exceptions_input.parent().append(el_proxy_exceptions_textarea);

    $('#proxyexception_copy').on('click', function(){
        proxy_exceptions_list = $('#proxyexceptions_list').val().trim();

        el_proxy_exceptions_input.val(proxy_exceptions_list.replace(/\r?\n/g,','));
    });
}

// ***********************************************
// Edit Config Tool Device Info
// ***********************************************
function editConfigDevice()
{

    // Database
    // *******************************************

    // LEGEND
    // desk ip
    var desk_ip = window.location.hostname;
    var desk_name = '';
    var master_ip = '';
    var master_name = '';
    var redis_name = '';

    redis_name = $('legend[data-source-property="redisgroup"]').text();
    master_ip = redis_name.split(' ').pop().trim();

    if(dw_desks[master_ip] !== undefined)
    {
        master_name = ' &nbsp; <i class="fal fa-chart-network"></i> '+dw_desks[master_ip][0]+' <span class="custom-tag-role custom-tag-role-master">Master</span>';

        if(desk_ip == master_ip)
        {
            master_name += '<span class="custom-tag-role custom-tag-role-me">Me</span>';
        }
        else
        {
            master_name += '<span class="custom-tag-role custom-tag-role-replica">Not me</span>';
        }
    }

    $('legend[data-source-property="redisgroup"]').append(master_name);

    if(dw_desks[desk_ip] !== undefined)
    {
        if(dw_desks[desk_ip][1])
        {
            desk_name += ' &nbsp; <i class="fal fa-database"></i> '+dw_desks[desk_ip][1];
        }
    }

    $('legend[data-source-property="redisgroup"]').append(desk_name);




    // HEADERS

    // add column for desks
    var table_column_ip;
    //var desk_ip;

    if($('table#database_redisgroup').find('th:contains("IP Address")').length)
    {
       table_column_ip = $('table#database_redisgroup').find('th:contains("IP Address")').index() + 1;
    }
    if(table_column_ip > 0)
    {
        $('table#database_redisgroup').find('> thead > tr > th:nth-child('+table_column_ip+')').after('<th class="readonly text-right" rowspan="1" colspan="1" style="width: 0px;">Desk</th>');
        $('table#database_redisgroup').find('> tbody > tr > td:nth-child('+table_column_ip+')').after('<td></td>');
    }

    // add column for user name
    var table_column_user;

    if($('table#database_redisgroup').find('th:contains("User")').length)
    {
        table_column_user = $('table#database_redisgroup').find('th:contains("User")').index() + 1;
    }
    if(table_column_user > 0)
    {
        $('table#database_redisgroup').find('> thead > tr > th:nth-child('+table_column_user+')').after('<th class="readonly text-left" rowspan="1" colspan="1" style="width: 0px;">UserName</th>');
        $('table#database_redisgroup').find('> tbody > tr > td:nth-child('+table_column_user+')').after('<td class="text-left"></td>');
    }

    // edit column for redis information
    var column_redis_server = $('table#database_redisgroup').find('th:contains("Redis Server")').index() + 1;
    var column_redis_sentinel = $('table#database_redisgroup').find('th:contains("Redis Sentinel")').index() + 1;

    $('table#database_redisgroup').find('> thead > tr > th:nth-child('+column_redis_server+')').html('Redis<br>Server');
    $('table#database_redisgroup').find('> thead > tr > th:nth-child('+column_redis_sentinel+')').html('Redis<br>Sentinel');

    // move column User
    moveColumn($('table#database_redisgroup'), $('table#database_redisgroup').find('> thead > tr > th:contains("User")').index(), $('table#database_redisgroup').find('> thead > tr > th:contains("Status")').index() + 1);

    // move column UserName
    moveColumn($('table#database_redisgroup'), $('table#database_redisgroup').find('> thead > tr > th:contains("UserName")').index(), $('table#database_redisgroup').find('> thead > tr > th:contains("User")').index() + 1);


    // desks

    // find column IP Address
    var column_ip = $('table#database_redisgroup').find('> thead > tr > th:contains("IP Address")').index() + 1;

    // find column Desk
    var column_desk = $('table#database_redisgroup').find('> thead > tr > th:contains("Desk")').index() + 1;

    // find column Status
    var column_status = $('table#database_redisgroup').find('> thead > tr > th:contains("Status")').index() + 1;

    // find column License (DeskWall)
    var column_license = $('table#database_redisgroup').find('> thead > tr > th:contains("DeskWall")').index() + 1;

    // find column Version
    var column_version = $('table#database_redisgroup').find('> thead > tr > th:contains("Version")').index() + 1;

    // find column Role
    var column_role = $('table#database_redisgroup').find('> thead > tr > th:contains("Role")').index() + 1;

    // find column User
    var column_user = $('table#database_redisgroup').find('> thead > tr > th:contains("User")').index() + 1;

    // find column User Name
    var column_username = $('table#database_redisgroup').find('> thead > tr > th:contains("UserName")').index() + 1;

    // get highest version
    var version_max = '0';

    $('table#database_redisgroup').find('> tbody > tr').each(function(){
        var desk_version_element = $(this).find('> td:nth-child('+column_version+')');
        var desk_version = desk_version_element.text();

        if(desk_version != '')
        {
            if(versionCompare(desk_version, version_max) == 1)
            {
               version_max = desk_version;
            }
        }

    });

    // edit information
    $('table#database_redisgroup').find('> tbody > tr').each(function(){
        desk_ip = $(this).attr('id');

        editConfigDeviceDetails(desk_ip, column_ip, column_desk, column_status, column_license, column_version, column_role, column_user, column_username, version_max);
    });



    // Observer
    // +++++++++++++++++++++++++++++++++++++++++++
    //var observer_target = $('table#database_redisgroup');
    var observer_config = {
        attributes: true,
        attributeFilter: ["id"],
        attributeOldValue: true
    };

    var observer = new MutationObserver(function(mutations) {

        mutations.forEach(function(mutation){

            if(mutation.type == "attributes" && mutation.attributeName == "id")
            {
                desk_ip = mutation.oldValue;

                editConfigDeviceDetails(desk_ip, column_ip, column_desk, column_status, column_license, column_version, column_role, column_user, column_username, version_max);
            }
        });

    });

    $('table#database_redisgroup').find('> tbody > tr').each(function(){
        observer.observe(this, observer_config);
    });


    // EXTRA
    // GET DEVICES STATUS NUMBERS
    var device_status_numbers = '<span class="custom_desks_reload_all_number">'+getConfigDeviceStatusNumbers()+'</span>';

    $('legend[data-source-property="redisgroup"]').append(device_status_numbers);

    // HIDE LOADING INFORMATION
    $('#custom-database-loading').hide();
    $('#custom-database-loaded').show();



    // EXTRA
    // BUTTON TO RELOAD OFFLINE DESKS

    // add button
    var button_reload_all = '<button class="btn" id="custom_desks_reload_all" title="Herlaad offline desks"><i class="fal fa-2x fa-sync"></i> </button>';

    $('div#database_redisgroup_wrapper div.dt-buttons.btn-group').append(button_reload_all);

    // listener for click
    $('button#custom_desks_reload_all').on('click', function(){

        $('table#database_redisgroup').find('> tbody > tr').each(function(){
            desk_ip = $(this).attr('id');

            var desk_element = $('table#database_redisgroup').find('> tbody > tr[id="'+desk_ip+'"]');
            var desk_status_element = desk_element.find('> td:nth-child('+column_status+')');

            // get desk status
            var desk_edited = true;

            // desk status is red circle
            if(desk_status_element.find('svg:not(.custom-icon-user)').attr('data-icon') == 'circle')
            {
                desk_edited = false;
            }
            // desk status has no user icon
            if(desk_status_element.find('svg.custom-icon-user').length == 0)
            {
                desk_edited = false;
            }

            // click if not edited
            if(!desk_edited)
            {
                desk_element.find('> td:eq(0) > svg.fa-redo').click();
            }

        });

    });
}

// ***********************************************
// Edit Config Tool Device Info Database
// ***********************************************
function editConfigDeviceDatabase()
{
    // move database element
    var database_element = $('fieldset#fieldset-database').parent();
    var database_container = database_element.parent();

    database_element.prependTo(database_container);

    // add loading icon to legend
    var database_legend = database_element.find('> fieldset > legend');
    database_legend.append(' <span id="custom-database-loading"><i class="fal fa-sync"></i></span>');
    database_legend.append(' <span id="custom-database-loaded"><i class="fal fa-check"></i></span>');

    $('#custom-database-loaded').hide();
}

// ***********************************************
// Edit Config Tool Device Info Details
// ***********************************************
function editConfigDeviceDetails(desk_ip, column_ip, column_desk, column_status, column_license, column_version, column_role, column_user, column_username, version_max)
{
    var desk_ip_me = window.location.hostname;

    // get elements
    var desk_element = $('table#database_redisgroup').find('> tbody > tr[id="'+desk_ip+'"]');

    var desk_status_element = desk_element.find('> td:nth-child('+column_status+')');
    var desk_ip_element = desk_element.find('> td:nth-child('+column_ip+')');
    var desk_name_element = desk_element.find('> td:nth-child('+column_desk+')');
    var desk_license_element = desk_element.find('> td:nth-child('+column_license+')');
    var desk_version_element = desk_element.find('> td:nth-child('+column_version+')');
    var desk_role_element = desk_element.find('> td:nth-child('+column_role+')');
    var desk_user_element = desk_element.find('> td:nth-child('+column_user+')');
    var desk_username_element = desk_element.find('> td:nth-child('+column_username+')');

    if(!desk_element.hasClass('processed'))
    {
        // reset
        desk_username_element.html('');

        // get desk status
        var desk_status = 'offline';
        if(desk_status_element.find('svg').attr('data-icon') == 'check-circle' || desk_status_element.find('i').css('color') == 'rgb(0, 128, 0)')
        {
            desk_status = 'online';
        }
        else if(desk_status_element.find('svg').attr('data-icon') == 'question-circle' || desk_status_element.find('i').css('color') == 'orange')
        {
            desk_status = 'unknown';
        }

        if(dw_desks[desk_ip] !== undefined)
        {
           // edit desk ip address
            var desk_config_tool = ' <a class="custom-icon-state-'+desk_status+' custom-icon-link" href="https://'+desk_ip+':54318/deskwall/device" title="Open '+dw_desks[desk_ip][0]+' Config Tool"><i class="fal fa-wrench"></i></a>';

            desk_ip_element.append(desk_config_tool);
            //desk_ip_element.addClass('text-right');


            // add desk name
            var desk_name = '';
            var desk_support_tool = ' <a class="custom-icon-state-'+desk_status+' custom-icon-link" href="https://'+desk_ip+':54381/support/supservices" title="Open '+dw_desks[desk_ip][0]+' Support Tool"><i class="fal fa-cogs"></i></a>';

            desk_name += dw_desks[desk_ip][0] + desk_support_tool;

            desk_name_element.html(desk_name);
            desk_name_element.addClass('text-right');


            // get desk icon informatien
            var desk_icon = getDwDeskIcon(desk_ip);

            var desk_icon_type = desk_icon[0];
            var desk_icon_name = desk_icon[1];


            // get user number
            var desk_user_status = 'offline';
            var desk_user_number = '';
            var desk_user_name = '';

            if(desk_status == 'online' || desk_status == 'unknown')
            {
                if(desk_user_element.text() != '')
                {
                    desk_user_status = 'online';
                    desk_user_number = desk_user_element.text();
                }
                else
                {
                    desk_user_status = 'empty';
                }
            }

            // get user icon informatien
            var user_icon = getDwUserIcon(desk_user_number);

            var user_icon_type = user_icon[0];
            var user_icon_name = user_icon[1];

            // get user type
            var desk_user_type_color = 'empty';

            if(dw_users[desk_user_number] !== undefined)
            {
                desk_user_name = dw_users[desk_user_number][0];

            }

            // edit desk status
            // edit desk user

            if(desk_status == 'online' || desk_status == 'unknown')
            {
                if(desk_user_element.text() != '')
                {
                    desk_user_status = 'online';
                    desk_user_number = desk_user_element.text();

                    // change the color of the special users
                    if(dw_users[desk_user_number] !== undefined)
                    {
                        desk_user_type_color = 'online';

                        if(dw_users[desk_user_number][1] !== undefined)
                        {
                            if(dw_users[desk_user_number][1] == 'SEC')
                            {
                                desk_user_type_color = 'special';
                            }
                            else if(dw_users[desk_user_number][1] == 'MV')
                            {
                                desk_user_type_color = 'special';
                            }
                        }
                    }
                    else
                    {
                        desk_user_name = '<span class="custom-icon-state-offline custom-icon-user">Unknown</span>';
                    }
                }
                else
                {
                    desk_user_status = 'empty';
                }
            }

            var desk_status_icon = '<i class="fal fa-'+desk_icon_type+' custom-icon-state-'+desk_user_status+' custom-icon-user" title="'+desk_icon_name+'"></i> '
            desk_status_element.append('<span style="display: inline-block; min-width: 40px; text-align: center;">'+desk_status_icon+'</span>');

            var desk_user_icon = '';
            var desk_user_style_icon = '';

            if(desk_user_status == 'online')
            {
                desk_user_icon = '<i class="fal fa-user-circle custom-icon-state-'+desk_user_status+' custom-icon-user"></i> ';
                desk_user_element.prepend(desk_user_icon);

                desk_user_style_icon = '<i class="fal fa-'+user_icon_type+' custom-icon-state-'+desk_user_type_color+' custom-icon-user" title="'+user_icon_name+'"></i> ';
                desk_username_element.html(desk_user_style_icon+desk_user_name);

                desk_user_element.attr('style','');
                desk_username_element.attr('style','white-space: nowrap;');
            }
            if(desk_user_status == 'empty')
            {
                desk_user_icon = '<i class="fal fa-user-circle custom-icon-state-'+desk_user_status+' custom-icon-user" title="Free"></i> ';
                desk_user_element.prepend(desk_user_icon + '<span style="color: darkgray;">Free</span>');

                desk_user_element.attr('style','');
            }
        }

        // edit desk license markup
        desk_license_element.html(desk_license_element.html().replace(/DeskWall without license/gi,'<span class="custom-tag-license custom-tag-license-none">DW without license</span>'));
        desk_license_element.html(desk_license_element.html().replace(/DeskWall Player/gi,'<span class="custom-tag-license custom-tag-license-deskwall">DW Player</span>'));
        desk_license_element.html(desk_license_element.html().replace(/DataWall/gi,'<span class="custom-tag-license custom-tag-license-deskwall">DataWall</span>'));

        // edit desk role markup
        desk_role_element.text(desk_role_element.text().replace(/, /gi,''));
        desk_role_element.html(desk_role_element.html().replace(/Master/gi,'<span class="custom-tag-role custom-tag-role-master">Master</span>'));
        desk_role_element.html(desk_role_element.html().replace(/Replica/gi,'<span class="custom-tag-role custom-tag-role-replica">Replica</span>'));
        desk_role_element.html(desk_role_element.html().replace(/Sentinel/gi,'<span class="custom-tag-role custom-tag-role-sentinel">Sentinel</span>'));

        if(desk_ip == desk_ip_me)
        {
            desk_role_element.prepend('<span class="custom-tag-role custom-tag-role-me">Me</span>');
        }

        // edit desk version markup
        var desk_version = desk_version_element.text();

        if(desk_version != '')
        {
            var desk_version_icon = ' <i class="fal fa-check-circle custom-icon-state-new custom-icon-version"></i>';

            if(versionCompare(desk_version, version_max))
            {
                desk_version_icon = ' <i class="fal fa-exclamation-circle custom-icon-state-old custom-icon-version"></i>';
            }

            desk_version_element.append(desk_version_icon);
        }

        // get device status numbers
        $('.custom_desks_reload_all_number').html(getConfigDeviceStatusNumbers());


        // mark as processed
        desk_element.addClass('processed');
    }

    // remove as processed
    if(desk_status_element.find('svg').attr('data-icon') === undefined)
    {
        desk_element.removeClass('processed');
    }
}

// ***********************************************
// Get devices status numbers
// ***********************************************
function getConfigDeviceStatusNumbers()
{
    var desk_ip;
    var online = 0;
    var offline = 0;

    // find column Status
    var column_status = $('table#database_redisgroup').find('> thead > tr > th:contains("Status")').index() + 1;

    $('table#database_redisgroup').find('> tbody > tr').each(function(){
        desk_ip = $(this).attr('id');

        var desk_element = $('table#database_redisgroup').find('> tbody > tr[id="'+desk_ip+'"]');
        var desk_status_element = desk_element.find('> td:nth-child('+column_status+')');

        // get desk status
        if(desk_status_element.find('svg:not(.custom-icon-user)').attr('data-icon') == 'check-circle' || (desk_ip == 'localhost' && desk_status_element.find('svg:not(.custom-icon-user)').attr('data-icon') === undefined))
        {
            online++;
        }
        else
        {
            offline++;
        }
    });

    var status = '';

    status += '<i class="fas fa-check-circle" style="color: green; margin-left: 5px;"></i> <span style="color: green;">'+online+'</span>';
    status += '<i class="fas fa-circle" style="color: '+(offline == 0 ? 'lightgray' : 'red')+'; margin-left: 15px;"></i>  <span style="color: '+(offline == 0 ? 'lightgray' : 'red')+';">'+offline+'</span>';

    return status;
}

// ***********************************************
// Edit Config Tool Users
// ***********************************************
function editConfigUsers()
{
    // overview
    if($('div#users').length)
    {
        // table(s): optimize
        $('table#users-table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('table#users-table').find('> thead > tr > th:nth-child(3)').attr('style', 'width: auto;');
        $('table#users-table').find('> thead > tr > th:nth-child(6)').attr('style', 'width: 20px;');


        // users: tags
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation){
                if(mutation.type === 'childList' && mutation.addedNodes.length)
                {
                    editConfigUsersOverview();
                }
            });
        });
        observer.observe($('table#users-table tbody')[0], {childList: true});

        editConfigUsersOverview();
    }


    // single
    else if($('div#article').length)
    {
        // user information: auto open
        $('fieldset.fieldset.container').find('> legend > button').click();
        $('fieldset.fieldset.container').addClass('border-success');

        // user groups: auto open
        $('fieldset[data-source-property="groups"]').find('> legend > button').click();
        $('fieldset[data-source-property="groups"]').addClass('border-success');
    }
}
function editConfigUsersOverview()
{
    // add extra columns
    if($('table#users-table').find('th').length == 6)
    {
        $('table#users-table').find('> thead > tr > th:nth-child(2)').after('<th style="color: green; width: 250px;">First Name</th><th style="color: green; width: 250px;">Last Name</th>');
    }

    // table(s): optimize
    $('table#users-table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
    $('table#users-table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: 100px;');
    $('table#users-table').find('> thead > tr > th:nth-child(5)').attr('style', 'width: auto;');
    $('table#users-table').find('> thead > tr > th:nth-child(6)').attr('style', 'width: 100px;');
    $('table#users-table').find('> thead > tr > th:nth-child(7)').attr('style', 'width: 100px;');
    $('table#users-table').find('> thead > tr > th:nth-child(8)').attr('style', 'width: 14px;');


    $('table#users-table tbody tr').each(function(){

        // add extra column for name
        if($(this).find('td').length == 6)
        {
            $(this).find('td:nth-child(2)').after('<td></td><td></td>');
        }

        var user_id = $(this).attr('id');
        var user_username = $(this).find('td:nth-child(2)').text();

        var first_name_cell = $(this).find('td:nth-child(3)');
        var last_name_cell = $(this).find('td:nth-child(4)');

        $.ajax({
            method: 'GET',
            url: '/api/user/' + user_id,
            xhrFields: { withCredentials: true },
            contentType: 'application/json',
            datatype: 'json',
            success: function(data, textStatus, jqXHR) {

                if ("string" == typeof data && data)
                {
                    data = JSON.parse(data);

                    if (data && data.user && data.user.usertokeninfo && data.user.usertokeninfo.toLowerCase() == user_username.toLowerCase())
                    {
                        first_name_cell.html(data.user.name);
                        last_name_cell.html(data.user.familyname);
                    }
                }
            }
        });

    });


    var type;
    var tag;

    $('table#users-table').find('> tbody > tr > td:nth-child(7)').each(function(){
        type = $(this).text();

        switch(type.toLowerCase())
        {
            case 'ldap':
                tag = '<span class="custom-tag-role custom-tag-role-master">LDAP</span>';
                break;

            case 'local':
                tag = '<span class="custom-tag-role custom-tag-role-sentinel">LOCAL</span>';
                break;
        }

        $(this).html(tag);
    });

}

// ***********************************************
// Edit Config Tool Groups
// ***********************************************
function editConfigGroups()
{
    // overview
    if($('fieldset#local-fieldset').length)
    {
        // table(s): optimize
        $('table#ldap-table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('table#ldap-table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: auto;');
        $('table#ldap-table').find('> thead > tr > th:nth-child(3)').attr('style', 'width: auto;');

        $('table#group-table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('table#group-table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: auto;');
        $('table#group-table').find('> thead > tr > th:nth-child(4)').attr('style', 'width: 20px;');


        // local groups: auto open
        $('fieldset#local-fieldset').find('legend > button').click();
        $('fieldset#local-fieldset').addClass('border-success');


        // ldap-groups: filter
        $('table#ldap-table').find('> tbody > tr > td:nth-child(3)').each(function(){
            $(this).attr('style', 'color: #AAAAAA;');

            var filter = $(this).html();
            filter = filter.replace('CN=', 'CN=<span style="color: #757575; white-space: nowrap">');
            filter = filter.replace(',OU=', '</span>,OU=');

            $(this).html(filter);
        });
    }


    // new
    if($('div#group'))
    {
        // filter: default
        $('input#newgroup-filter').val('CN=APS-L5345-PERM-P-DYN-DESKWALL_XXX_FLAT,OU=Apps,OU=Groups');
    }


    // single
    if($('fieldset#rights').length)
    {
        // table(s): optimize
        $('table#groupusers-table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('table#groupusers-table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: 100px;');
        $('table#groupusers-table').find('> thead > tr > th:nth-child(3)').attr('style', 'width: 100px;');

        $('table#allusers-table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('table#allusers-table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: 100px;');
        $('table#allusers-table').find('> thead > tr > th:nth-child(3)').attr('style', 'width: 100px;');

        $('table#permissions-table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: auto;');
        $('table#permissions-table').find('> thead > tr > th:nth-child(3)').attr('style', 'width: 50px;');
        $('table#permissions-table').find('> thead > tr > th:nth-child(4)').attr('style', 'width: 50px;');
        $('table#permissions-table').find('> thead > tr > th:nth-child(5)').attr('style', 'width: 50px;');

        // add extra columns
        $('table#groupusers-table').find('> thead > tr > th:nth-child(3)').after('<th style="color: green; width: 30px;">Type</th><th style="color: green; width: auto;">Name</th>');
        $('table#allusers-table').find('> thead > tr > th:nth-child(3)').after('<th style="color: green; width: 30px;">Type</th><th style="color: green; width: auto;">Name</th>');
        $('table#permissions-table').find('> thead > tr > th:nth-child(5)').after('<th style="color: green; width: 50px;">Icon</th><th style="color: green;">Name</th><th style="color: green; width: 100px;">Type</th><th style="color: green; width: 20px;" title="Toon in menu"><i class="fas fa-bars"></i></th><th style="color: green; width: 35px;" title="Whitelisted"><i class="fas fa-desktop"></i></th>');


        // permissions: auto open
        $('fieldset#rights').find('legend > button').click();
        $('fieldset#rights').addClass('border-success');


        // buttons: restyle
        $('div.dt-buttons button.btn-light').removeClass('btn-light').addClass('btn-success');
        $('div.dt-buttons').prepend('<button class="btn btn-success bg-success text-light" type="button" id="custom-permissions-select-all" title="Select all"><span><i class="fas fa-check-square"></i></span></button>');

        // dataTable: enable multiselect click (default: "os": CTRL+click to select multiple)
        $('table#permissions-table').dataTable().fnSettings()._select.style = "multi";
        $('table#permissions-table').dataTable().fnDraw();

        // click select all
        $('button#custom-permissions-select-all').on('click', function(){
            $('div#permissions-table_filter input[type="search"]').focus().trigger('click');

            $('table#permissions-table tbody tr').each(function(){
                $(this).find('td:first-of-type').click();
            });
        });

        $('div#permissions-table_wrapper button span:contains("Access")').on('click', function(){
            var column = $('table#permissions-table thead th:contains("Access")').index();

            $('table#permissions-table tbody tr').each(function(){
                if($(this).find('td:nth('+column+')').html() == '')
                {
                    $(this).find('td:first-of-type').click();
                }
            });
        });
        $('div#permissions-table_wrapper button span:contains("Edit")').on('click', function(){
            var column = $('table#permissions-table thead th:contains("Edit")').index();

            $('table#permissions-table tbody tr').each(function(){
                if($(this).find('td:nth('+column+')').html() == '')
                {
                    $(this).find('td:first-of-type').click();
                }
            });
        });
        $('div#permissions-table_wrapper button span:contains("Admin")').on('click', function(){
            var column = $('table#permissions-table thead th:contains("Admin")').index();

            $('table#permissions-table tbody tr').each(function(){
                if($(this).find('td:nth('+column+')').html() == '')
                {
                    $(this).find('td:first-of-type').click();
                }
            });
        });


        // USERS

        // table page: users in group
        var observer_groupusers = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation){
                if(mutation.type === 'childList' && mutation.addedNodes.length)
                {
                    editConfigGroupsUsersInTable();
                }
            });
        });
        observer_groupusers.observe($('div#groupusers-table_paginate')[0], {childList: true});

        editConfigGroupsUsersInTable();

        // table page: all users
        var observer_allusers = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation){
                if(mutation.type === 'childList' && mutation.addedNodes.length)
                {
                    editConfigGroupsUsersAllTable();
                }
            });
        });
        observer_allusers.observe($('div#allusers-table_paginate')[0], {childList: true});

        editConfigGroupsUsersAllTable();


        // PERMISSIONS

        // table search: create filters
        var filters = '';

        filters += '<div class="btn-group">';
        filters += '<button class="btn btn-secondary text-success disabled"><i class="fas fa-filter"></i></button>';

        filters += '<button class="cust-search-filter btn btn-success text-success">action</button>';
        filters += '<button class="cust-search-filter btn btn-success text-success">layout</button>';
        filters += '<button class="cust-search-filter btn btn-success text-success">source</button>';

        filters += '</div>';

        var clear = '';
        clear += '<div class="btn-group mr-2">';
        clear += '<button class="btn btn-secondary text-secondary" id="custom-clear-filter" title="Clear filters"><i class="fas fa-sync"></i></button>';
        clear += '</div>';

        $('div#permissions-table_filter').prepend(filters).prepend(clear);

        // table search: set filter
        $('button.cust-search-filter').on('click', function(){
            $('div#permissions-table_filter input[type="search"]').focus().trigger('click');

            // set value
            document.execCommand('selectAll');
            document.execCommand('insertText', false, $(this).text());

            // save value
            localStorage.setItem('dw_groups_table_search', $(this).text());
        });

        // table search: clear filters
        $('button#custom-clear-filter').on('click', function(){
            // clear values
            localStorage.clear();

            // reload page
            location.reload();
        });


        // table search: defaults
        var defaults = '';

        defaults += '<div class="btn-group ml-2">';
        defaults += '<button class="btn btn-secondary text-success disabled"><i class="far fa-star"></i></button>';

        defaults += '<button class="btn btn-success text-success" id="custom-permissions-default-actions" type="button">action</button>';
        defaults += '<button class="btn btn-success text-danger" id="custom-permissions-default-sources" type="button">source</button>';
        defaults += '</div>';

        $('div#permissions-table_wrapper div.flexrow:first-of-type div.table-wrapper:first-of-type').append(defaults);

        // table search: select defaults
        $('button#custom-permissions-default-actions').on('click', function(){
            $('tr[id="rights:action:audio"] td:eq(1)').click();
            $('tr[id="rights:action:changegrid"] td:eq(1)').click();
            $('tr[id="rights:action:closeall"] td:eq(1)').click();
            $('tr[id="rights:action:desktops"] td:eq(1)').click();
            $('tr[id="rights:action:hotcorners"] td:eq(1)').click();
            $('tr[id="rights:action:lock"] td:eq(1)').click();
            $('tr[id="rights:action:login"] td:eq(1)').click();
            $('tr[id="rights:action:logout"] td:eq(1)').click();
            $('tr[id="rights:action:menu"] td:eq(1)').click();
            $('tr[id="rights:action:opensession"] td:eq(1)').click();
            $('tr[id="rights:action:opensource"] td:eq(1)').click();
            $('tr[id="rights:action:preferences"] td:eq(1)').click();
            $('tr[id="rights:action:reboot"] td:eq(1)').click();
            $('tr[id="rights:action:reorganize"] td:eq(1)').click();
            $('tr[id="rights:action:sessionmanager"] td:eq(1)').click();
            $('tr[id="rights:action:snippingtool"] td:eq(1)').click();
            $('tr[id="rights:action:volume"] td:eq(1)').click();
        });
        $('button#custom-permissions-default-sources').on('click', function(){
            // meldkamer
            $('tr[id="rights:source:cad_cof_2"] td:eq(1)').click();
            $('tr[id="rights:source:config"] td:eq(1)').click();
            $('tr[id="rights:source:genetec_test"] td:eq(1)').click();
            $('tr[id="rights:source:gesab"] td:eq(1)').click();
            $('tr[id="rights:source:horizon"] td:eq(1)').click();
            $('tr[id="rights:source:laptof_cof_test_2"] td:eq(1)').click();
            $('tr[id="rights:source:laptop_cof_test"] td:eq(1)').click();
            $('tr[id="rights:source:mv_pc_01"] td:eq(1)').click();
            $('tr[id="rights:source:mv_pc_01_test"] td:eq(1)').click();
            $('tr[id="rights:source:mv_pc_02"] td:eq(1)').click();
            $('tr[id="rights:source:mv_pc_03"] td:eq(1)').click();
            $('tr[id="rights:source:mv_pc_04"] td:eq(1)').click();
            $('tr[id="rights:source:mv_pc_05"] td:eq(1)').click();
            $('tr[id="rights:source:test_cad_bo2"] td:eq(1)').click();
            $('tr[id="rights:source:test_camera"] td:eq(1)').click();
            $('tr[id="rights:source:test_disp_1"] td:eq(1)').click();
            $('tr[id="rights:source:tjilp"] td:eq(1)').click();
            $('tr[id="rights:source:tobania"] td:eq(1)').click();
            $('tr[id="rights:source:tooling_vis"] td:eq(1)').click();
            $('tr[id="rights:source:videofoon"] td:eq(1)').click();
            $('tr[id="rights:source:vmgen30101"] td:eq(1)').click();
            $('tr[id="rights:source:vmgen30102"] td:eq(1)').click();
            $('tr[id="rights:source:vmgen30103"] td:eq(1)').click();
            $('tr[id="rights:source:vmgen30104"] td:eq(1)').click();
            $('tr[id="rights:source:vmgencamst01"] td:eq(1)').click();
            $('tr[id="rights:source:vmgencamst02"] td:eq(1)').click();
            $('tr[id="rights:source:wall_blauwe_lijn"] td:eq(1)').click();
            $('tr[id="rights:source:wall_links"] td:eq(1)').click();
            $('tr[id="rights:source:wall_links_aansturen"] td:eq(1)').click();
            $('tr[id="rights:source:wall_rechts"] td:eq(1)').click();
            $('tr[id="rights:source:wall_rechts_aansturen"] td:eq(1)').click();

            // commando
            $('tr[id="rights:source:_grafana"] td:eq(1)').click();
            $('tr[id="rights:source:amigo_winguard_test"] td:eq(1)').click();
            $('tr[id="rights:source:api_wallcontroller"] td:eq(1)').click();
            $('tr[id="rights:source:api_wallcontroller_acc"] td:eq(1)').click();
            $('tr[id="rights:source:bommen_en_granaten"] td:eq(1)').click();
            $('tr[id="rights:source:bommen_en_granaten_rtic"] td:eq(1)').click();
            $('tr[id="rights:source:cad_test"] td:eq(1)').click();
            $('tr[id="rights:source:cadbo1realvnc_test"] td:eq(1)').click();
            $('tr[id="rights:source:deepl"] td:eq(1)').click();
            $('tr[id="rights:source:genetec_celd1"] td:eq(1)').click();
            $('tr[id="rights:source:jotest"] td:eq(1)').click();
            $('tr[id="rights:source:test"] td:eq(1)').click();
            $('tr[id="rights:source:test_thomas"] td:eq(1)').click();
            $('tr[id="rights:source:thomas_test_2"] td:eq(1)').click();
            $('tr[id="rights:source:tooling1"] td:eq(1)').click();
            $('tr[id="rights:source:tooling2"] td:eq(1)').click();
            $('tr[id="rights:source:vnc_scaling_test"] td:eq(1)').click();
            $('tr[id="rights:source:vnc_test"] td:eq(1)').click();
            $('tr[id="rights:source:vnc_tester"] td:eq(1)').click();
            $('tr[id="rights:source:webcam_test"] td:eq(1)').click();
        });


        // table search: get value
        if(localStorage.getItem('dw_groups_table_search') !== null && localStorage.getItem('dw_groups_table_search') !== '')
        {
            // select input
            $('div#permissions-table_filter input[type="search"]').focus().trigger('click');

            // set value
            document.execCommand('insertText', false, localStorage.getItem('dw_groups_table_search'));

            // highlight
            $('div#permissions-table_filter input[type="search"]').addClass('border-success').blur();
        }

        // table search: save value
        $('div#permissions-table_filter input[type="search"]').on('keyup', function(){
            localStorage.setItem('dw_groups_table_search', $(this).val());
        });


        // table length: get value
        if(localStorage.getItem('dw_groups_table_length') !== null)
        {
            // select option
            var el = document.querySelector('select[name="permissions-table_length"]');
            el.options[localStorage.getItem('dw_groups_table_length')].selected = true;

            // set value
            el.dispatchEvent(new Event('change', { bubbles: true }));

            // highlight
            $('select[name="permissions-table_length"]').addClass('border-success').blur();
        }

        // table length: save value
        $('select[name="permissions-table_length"]').on('change', function(){
            localStorage.setItem('dw_groups_table_length', $('select[name="permissions-table_length"]')[0].selectedIndex);
        });


        // table page
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation){
                if(mutation.type === 'childList' && mutation.addedNodes.length)
                {
                    var previous_page = localStorage.getItem('dw_groups_table_page');

                    // table page: save value
                    if(localStorage.getItem('dw_groups_table_page_goto') !== '1' || previous_page == null)
                    {
                        localStorage.setItem('dw_groups_table_page', $('div#permissions-table_paginate ul.pagination li.active a').text());

                        // highlight
                        if(localStorage.getItem('dw_groups_table_page_set') == '1')
                        {
                            $('div#permissions-table_paginate ul.pagination li.active a').addClass('bg-success border-success');

                            localStorage.setItem('dw_groups_table_page_set', '0');
                        }
                    }

                    // table page: get value
                    if(localStorage.getItem('dw_groups_table_page') !== null && (localStorage.getItem('dw_groups_table_page') != previous_page))
                    {
                        editConfigGroupsPaginate();
                    }

                    editConfigGroupsPermissionsTable();
                }
            });
        });
        observer.observe($('div#permissions-table_paginate')[0], {childList: true});

        if(localStorage.getItem('dw_groups_table_page') !== null)
        {
            editConfigGroupsPaginate();
        }

        editConfigGroupsPermissionsTable();
    }
}
function editConfigGroupsUsersInTable()
{
    $('table#groupusers-table tbody tr').each(function(){

        // add extra column for name
        if($(this).find('td').length == 3)
        {
            $(this).find('td:nth-child(3)').after('<td></td><td></td>');
        }

        var user_id = $(this).attr('id');
        var user_username = $(this).find('td:nth-child(2)').text();

        var type_cell = $(this).find('td:nth-child(4)');
        var name_cell = $(this).find('td:nth-child(5)');

        $.ajax({
            method: 'GET',
            url: '/api/user/' + user_id,
            xhrFields: { withCredentials: true },
            contentType: 'application/json',
            datatype: 'json',
            success: function(data, textStatus, jqXHR) {

                if ("string" == typeof data && data)
                {
                    data = JSON.parse(data);

                    if (data && data.user && data.user.usertokeninfo && data.user.usertokeninfo.toLowerCase() == user_username.toLowerCase())
                    {
                        name_cell.html(data.user.name+' '+data.user.familyname);

                        if(data.user.dn)
                        {
                            type_cell.html('<span class="custom-tag-role custom-tag-role-master">LDAP</span>');
                        }
                        else
                        {
                            type_cell.html('<span class="custom-tag-role custom-tag-role-sentinel">LOCAL</span>');
                        }
                    }
                }
            }
        });

    });
}
function editConfigGroupsUsersAllTable()
{
    $('table#allusers-table tbody tr').each(function(){

        // add extra column for name
        if($(this).find('td').length == 3)
        {
            $(this).find('td:nth-child(3)').after('<td></td><td></td>');
        }

        var user_id = $(this).attr('id');
        var user_username = $(this).find('td:nth-child(2)').text();

        var type_cell = $(this).find('td:nth-child(4)');
        var name_cell = $(this).find('td:nth-child(5)');

        $.ajax({
            method: 'GET',
            url: '/api/user/' + user_id,
            xhrFields: { withCredentials: true },
            contentType: 'application/json',
            datatype: 'json',
            success: function(data, textStatus, jqXHR) {

                if ("string" == typeof data && data)
                {
                    data = JSON.parse(data);

                    if (data && data.user && data.user.username && data.user.username.toLowerCase() == user_username.toLowerCase())
                    {
                        name_cell.html(data.user.name+' '+data.user.familyname);

                        if(data.user.dn)
                        {
                            type_cell.html('<span class="custom-tag-role custom-tag-role-master">LDAP</span>');
                        }
                        else
                        {
                            type_cell.html('<span class="custom-tag-role custom-tag-role-sentinel">LOCAL</span>');
                        }
                    }
                }
            }
        });

    });
}
function editConfigGroupsPermissionsTable()
{
    $('table#permissions-table tbody tr').each(function(){

        // add extra column for name
        if($(this).find('td').length == 5)
        {
            $(this).find('td:nth-child(5)').after('<td></td><td></td><td></td><td></td><td></td>');
        }

        // highlight id based on acccess permissions
        var permission_link = $(this).find('td:nth-child(2) a');
        var access_cell = $(this).find('td:nth-child(3)');
        var icon_cell = $(this).find('td:nth-child(6)');
        var name_cell = $(this).find('td:nth-child(7)');
        var sourcetype_cell = $(this).find('td:nth-child(8)');
        var menu_cell = $(this).find('td:nth-child(9)');
        var whitelist_cell = $(this).find('td:nth-child(10)');

        if(access_cell[0].childNodes[0] !== undefined && access_cell[0].childNodes[0].classList.contains('fa-check'))
        {
            permission_link.attr('style', 'color: green;');
            name_cell.attr('style', 'color: green;');
        }
        else if(access_cell[0].childNodes[0] !== undefined && access_cell[0].childNodes[0].classList.contains('fa-minus-circle'))
        {
            permission_link.attr('style', 'color: #AAAAAA;');
            name_cell.attr('style', 'color: #AAAAAA;');
        }

        // get name based on id
        var element_id = $(this).attr('id');
        var element_id_array = element_id.split(':');

        if(element_id_array.length == 3)
        {
            var type = element_id_array[1];
            var id = element_id_array[2];

            // shorten long id
            if(id.length > 40)
            {
                permission_link.text(id.substring(0,40)+'...');
            }

            var api_route = '';
            var icon_map = '';

            switch(type)
            {
                case 'action':
                    api_route = 'action';
                    icon_map = '/ico/dw/';
                    break;

                case 'layout':
                    api_route = 'grids';
                    icon_map = '/ico/custom/';
                    break;

                case 'source':
                    api_route = 'apps';
                    icon_map = '/ico/custom/';
                    break;
            }

            if(api_route !== '')
            {
                $.ajax({
                    method: 'GET',
                    url: '/api/'+api_route+'/'+id.toLowerCase(),
                    xhrFields: { withCredentials: true },
                    contentType: 'application/json',
                    datatype: 'json',
                    success: function(data, textStatus, jqXHR) {
                        if ("string" == typeof data && data)
                        {
                            data = JSON.parse(data);

                            if (data && data.id && (data.id.toLowerCase() == id.toLowerCase()))
                            {
                                // icon
                                icon_cell.html('<img src="'+icon_map+data.icon+'" style="width: 25px; height: auto;" />');

                                // name
                                name_cell.html(data.title);

                                // sourcetype
                                if(type == 'source')
                                {
                                    var sourcetype_badge = '<span class="custom-tag-role custom-tag-role-sentinel">'+data.type+'</span>';
                                    var dwrt_list = '';

                                    if(data.dwrt_list !== undefined)
                                    {
                                        dwrt_list = '<span class="custom-tag-role custom-tag-role-sentinel" title="Encoders: '+data.dwrt_list.length+'">'+data.dwrt_list.length+'</span>';
                                    }

                                    sourcetype_cell.html(sourcetype_badge+dwrt_list);
                                }

                                // menu
                                if(data.showmenu !== undefined)
                                {
                                    var menu_icon = '';

                                    if(data.showmenu)
                                    {
                                        menu_icon = '<i class="fas fa-check-circle" style="color: green;" title="Tonen in menu"></i>';
                                    }
                                    else
                                    {
                                        menu_icon = '<i class="fas fa-times-circle" style="color: lightgray;" title="Niet tonen in menu"></i>';
                                    }

                                    menu_cell.html(menu_icon);
                                }

                                // whitelisted
                                if(data.alloweddevices !== undefined && data.alloweddevices.whitelist !== undefined &&  data.alloweddevices.whitelist.length > 0)
                                {
                                    whitelist_cell.html('<i class="fas fa-exclamation-circle" style="color: red;" title="Whitelisted: '+data.alloweddevices.whitelist.length+'"></i><sup style="color: red;">'+data.alloweddevices.whitelist.length+'</sup>');
                                }
                                // blacklisted
                                if(data.alloweddevices !== undefined && data.alloweddevices.blacklist !== undefined &&  data.alloweddevices.blacklist.length > 0)
                                {
                                    whitelist_cell.html('<i class="fas fa-exclamation-circle" style="color: black;" title="Blacklisted: '+data.alloweddevices.blacklist.length+'"></i><sup style="color: black;">'+data.alloweddevices.blacklist.length+'</sup>');
                                }
                            }
                        }
                    }
                });
            }
        }

    });

}
function editConfigGroupsPaginate()
{
    var page_found = false;

    $('div#permissions-table_paginate ul.pagination li:not(.active) a').each(function(){

        if($(this).text() === localStorage.getItem('dw_groups_table_page'))
        {
            page_found = true;

            localStorage.setItem('dw_groups_table_page_goto', '0');
            localStorage.setItem('dw_groups_table_page_set', '1');

            $(this).parent().click();
        }

    });

    if(!page_found && $('div#permissions-table_paginate ul.pagination li.active a').text() !== localStorage.getItem('dw_groups_table_page'))
    {
        localStorage.setItem('dw_groups_table_page_goto', '1');

        $('div#permissions-table_paginate ul.pagination li.next').click();

        editConfigGroupsPaginate();
    }
}

// ***********************************************
// Edit Config Tool Grids
// ***********************************************
function editConfigGrids()
{
    // overview
    if($('div#layouts').length)
    {
        // table(s): optimize
        $('table#layouts-table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('table#layouts-table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: 50px;').addClass('text-center');
        $('table#layouts-table').find('> thead > tr > th:nth-child(3)').attr('style', 'width: auto;');
        $('table#layouts-table').find('> thead > tr > th:nth-child(5)').attr('style', 'width: 20px;');


        // grids: icons
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation){
                if(mutation.type === 'childList' && mutation.addedNodes.length)
                {
                    editConfigGridsOverview();
                }
            });
        });
        observer.observe($('table#layouts-table tbody')[0], {childList: true});

        editConfigGridsOverview();
    }


    // single
    else if($('div#article').length)
    {
        // table(s): optimize
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: auto;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(3)').attr('style', 'width: 100px;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(4)').attr('style', 'width: 100px;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(5)').attr('style', 'width: 100px;');


        // zones: auto open
        $('fieldset[data-source-property="zones"]').find('> legend > button').click();
        $('fieldset[data-source-property="zones"]').addClass('border-success');



        // create buttons
        var multi = '';
        var multi_warning = '';

        multi += '<div class="flexrow">';

        multi += '<div class="dt-buttons btn-group">';
        multi += '<button class="btn btn-success bg-success text-light" type="button" id="custom-permissions-select-all" title="Select all"><span><i class="fas fa-check-square"></i></span></button>';
        multi += '<button class="btn btn-warning bg-warning text-dark" type="button" id="custom-permissions-select-all-no-admin" title="Select all but admins"><span><i class="far fa-check-square"></i></span></button>';
        multi += '<button class="btn btn-warning bg-warning text-dark" type="button" id="custom-permissions-select-users" title="Select users"><span><i class="far fa-check-square"></i></span></button>';
        multi += '<button class="btn btn-secondary d-none" type="button" id="custom-permissions-apply"><span>Apply</span></button>';
        multi += '<button class="btn btn-secondary disabled" type="button"><span>Access</span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="access" data-permission="yes"><span><i class="fas fa-check" color="green"></i></span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="access" data-permission="no"><span><i class="fas fa-times" color="red"></i></span></button>';
        multi += '<button class="btn btn-secondary disabled" type="button"><span>Edit</span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="edit" data-permission="yes"><span><i class="fas fa-check" color="green"></i></span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="edit" data-permission="no"><span><i class="fas fa-times" color="red"></i></span></button>';
        multi += '<button class="btn btn-secondary disabled" type="button"><span>Admin</span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="admin" data-permission="yes"><span><i class="fas fa-check" color="green"></i></span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="admin" data-permission="no"><span><i class="fas fa-times" color="red"></i></span></button>';
        multi += '</div>';

        multi_warning += '<div class="dt-buttons btn-group float-right d-none custom-permissions-warning">';
        multi_warning += '<button class="btn btn-warning bg-warning text-dark" type="button"><span><i class="fas fa-exclamation-triangle"></i> Er zijn niet-bewaarde aanpassingen</span></button>';
        multi_warning += '</div>';

        multi += multi_warning;

        multi += '</div>';

        $('div#rights_wrapper').prepend(multi);
        $('div#rights_info').after(multi_warning);


        // click select all
        $('button#custom-permissions-select-all').on('click', function(){
            $('table#rights tbody tr').each(function(){
                $(this).addClass('row-selected');
            });
        });
        // click select all (no admin)
        $('button#custom-permissions-select-all-no-admin').on('click', function(){
            $('table#rights tbody tr').each(function(){
                if($(this).attr('id').indexOf('admin') !== -1)
                {
                    $(this).removeClass('row-selected');
                }
                else
                {
                    $(this).addClass('row-selected');
                }
            });
        });
        // click select users
        $('button#custom-permissions-select-users').on('click', function(){
            $('table#rights tbody tr').each(function(){
                if($(this).attr('id').indexOf(':users') !== -1)
                {
                    $(this).addClass('row-selected');
                }
                else
                {
                    $(this).removeClass('row-selected');
                }
            });
        });


        // click permission
        var waiting = 150;
        var index;
        var items;

        var type;
        var permission;
        var permission_cell;
        var permission_minus = false;
        var select;

        $('button.custom-multi-permission').on('click', function(){

            // save permission information
            type = $(this).attr('data-type')
            permission = $(this).attr('data-permission');


            // save items
            items = [];
            index = 0;

            $('table#rights tr.row-selected').each(function(){
                items[index++] = $(this);
            });


            // loop items
            $.each(items, function(i){

                setTimeout(function(){

                    // type
                    switch(type)
                    {
                        case 'access':
                            permission_cell = items[i].find('td:nth-child(3)');
                            permission_minus = items[i].find('td:nth-child(3) svg.fa-minus').length;
                            permission_cell.click();
                            select = items[i].find('select#DTE_Field_read');
                            break;

                        case 'edit':
                            permission_cell = items[i].find('td:nth-child(4)');
                            permission_minus = items[i].find('td:nth-child(4) svg.fa-minus').length;
                            permission_cell.click();
                            select = items[i].find('select#DTE_Field_write');
                            break;

                        case 'admin':
                            permission_cell = items[i].find('td:nth-child(5)');
                            permission_minus = items[i].find('td:nth-child(5) svg.fa-minus').length;
                            permission_cell.click();
                            select = items[i].find('select#DTE_Field_admin');
                            break;
                    }

                    // permission
                    switch(permission)
                    {
                        case 'yes':
                            select.val('true').change();
                            break;

                        case 'no':
                            if(permission_minus)
                            {
                                select.val('true').change();
                                setTimeout(function(){
                                    $('#custom-permissions-apply').click();
                                    permission_cell.click();
                                    select.val('false').change();
                                }, 50);
                            }
                            else
                            {
                                select.val('false').change();
                            }
                            break;
                    }

                    setTimeout(function(){
                        $('#custom-permissions-apply').click();
                        $('.custom-permissions-warning').removeClass('d-none');
                    }, 100);

                }, waiting * i);

            });
        });

        $('button#save').on('click', function(){
            $('.custom-permissions-warning').addClass('d-none');
        });
    }
}
function editConfigGridsOverview()
{
    $('table#layouts-table').find('> tbody > tr > td:nth-child(2)').addClass('text-center');
}


// ***********************************************
// Edit Config Tool Sources
// ***********************************************
function editConfigSources()
{
    // overview
    if($('div#sources').length)
    {
        // table(s): optimize
        $('table#sources-table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('table#sources-table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: 50px;').addClass('text-center');
        $('table#sources-table').find('> thead > tr > th:nth-child(3)').attr('style', 'width: auto;');
        $('table#sources-table').find('> thead > tr > th:nth-child(5)').attr('style', 'width: 20px;');

        $('table#sources-table').find('> thead > tr > th:nth-child(5)').after('<th style="color: green; width: 20px;" title="Toon in menu"><i class="fas fa-bars"></i></th><th style="color: green; width: 35px;" title="Whitelisted"><i class="fas fa-desktop"></i></th>');


        // sources: icons
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation){
                if(mutation.type === 'childList' && mutation.addedNodes.length)
                {
                    editConfigSourcesOverview();
                }
            });
        });
        observer.observe($('table#sources-table tbody')[0], {childList: true});

        editConfigSourcesOverview();


        // table search: create filters
        var filters = '';

        filters += '<div class="btn-group">';
        filters += '<button class="btn btn-secondary text-success disabled"><i class="fas fa-filter"></i></button>';

        filters += '<button class="cust-search-filter btn btn-success text-success">Browser</button>';
        filters += '<button class="cust-search-filter btn btn-success text-success">RealVNC</button>';
        filters += '<button class="cust-search-filter btn btn-success text-success">TigerVNC</button>';
        filters += '<button class="cust-search-filter btn btn-success text-success">Horizon</button>';
        filters += '<button class="cust-search-filter btn btn-success text-success">RDP</button>';
        filters += '<button class="cust-search-filter btn btn-success text-success">Stream</button>';
        filters += '<button class="cust-search-filter btn btn-success text-success">Encoder</button>';
        filters += '<button class="cust-search-filter btn btn-success text-success">Utils</button>';
        filters += '</div>';

        var clear = '';
        clear += '<div class="btn-group mr-2">';
        clear += '<button class="btn btn-secondary text-secondary" id="custom-clear-filter" title="Clear filters"><i class="fas fa-sync"></i></button>';
        clear += '</div>';

        $('div#sources-table_filter').prepend(filters).prepend(clear);;

        // table search: set filter
        $('button.cust-search-filter').on('click', function(){
            $('input[type="search"]').focus().trigger('click');

            // set value
            document.execCommand('selectAll');
            document.execCommand('insertText', false, $(this).text());

            // save value (config tool automatic)
            //localStorage.setItem('dw_sources_table_search', $(this).text());
        });

        // table search: clear filters
        $('button#custom-clear-filter').on('click', function(){
            // clear values
            localStorage.clear();

            // reload page
            location.reload();
        });
    }


    // single
    else if($('div#article').length)
    {
        // table(s): optimize
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: auto;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(3)').attr('style', 'width: 100px;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(4)').attr('style', 'width: 100px;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(5)').attr('style', 'width: 100px;');

        $('table#alloweddevices_blacklist').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('table#alloweddevices_blacklist').find('> thead > tr > th:nth-child(2)').attr('style', 'width: auto;');

        $('table#alloweddevices_whitelist').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('table#alloweddevices_whitelist').find('> thead > tr > th:nth-child(2)').attr('style', 'width: auto;');


        // permissions: auto open?
        if(localStorage.getItem('dw_sources_permissions_auto_open') === '1')
        {
            localStorage.setItem('dw_sources_permissions_auto_open_script', '1');

            $('fieldset[data-source-property="rights"] button').click();
            $('fieldset[data-source-property="rights"]').addClass('border-success');

            localStorage.setItem('dw_sources_permissions_auto_open_script', '0');
        }

        // allowed devices: auto open?
        if(! ($('table#alloweddevices_blacklist').text().indexOf('No data') !== -1 && $('table#alloweddevices_whitelist').text().indexOf('No data') !== -1))
        {
            $('fieldset[data-source-property="alloweddevices"] > legend > button').click();
            $('fieldset[data-source-property="alloweddevices"]').addClass('border-success');

            if($('table#alloweddevices_blacklist').text().indexOf('No data') === -1)
            {
                $('fieldset[data-source-property="blacklist"] > legend > button').click();
                $('fieldset[data-source-property="blacklist"]').addClass('border-success');
            }
            if($('table#alloweddevices_whitelist').text().indexOf('No data') === -1)
            {
                $('fieldset[data-source-property="whitelist"] > legend > button').click();
                $('fieldset[data-source-property="whitelist"]').addClass('border-success');
            }
        }


        // permissions: save auto open
        $('fieldset[data-source-property="rights"] button').on('click', function(){

            if(localStorage.getItem('dw_sources_permissions_auto_open_script') === '0')
            {
                if($(this).attr('aria-expanded') === 'true')
                {
                    localStorage.setItem('dw_sources_permissions_auto_open', '0');
                }
                else
                {
                    localStorage.setItem('dw_sources_permissions_auto_open', '1');
                }

                $('fieldset[data-source-property="rights"]').removeClass('border-success');
            }
            else
            {
                localStorage.setItem('dw_sources_permissions_auto_open_script', '0');
            }
        });


        // create buttons
        var multi = '';
        var multi_warning = '';

        multi += '<div class="flexrow">';

        multi += '<div class="dt-buttons btn-group">';
        multi += '<button class="btn btn-success bg-success text-light" type="button" id="custom-permissions-select-all" title="Select all"><span><i class="fas fa-check-square"></i></span></button>';
        multi += '<button class="btn btn-warning bg-warning text-dark" type="button" id="custom-permissions-select-all-no-admin" title="Select all but admins"><span><i class="far fa-check-square"></i></span></button>';
        multi += '<button class="btn btn-warning bg-warning text-dark" type="button" id="custom-permissions-select-users" title="Select users"><span><i class="far fa-check-square"></i></span></button>';
        multi += '<button class="btn btn-secondary d-none" type="button" id="custom-permissions-apply"><span>Apply</span></button>';
        multi += '<button class="btn btn-secondary disabled" type="button"><span>Access</span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="access" data-permission="yes"><span><i class="fas fa-check" color="green"></i></span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="access" data-permission="no"><span><i class="fas fa-times" color="red"></i></span></button>';
        multi += '<button class="btn btn-secondary disabled" type="button"><span>Edit</span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="edit" data-permission="yes"><span><i class="fas fa-check" color="green"></i></span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="edit" data-permission="no"><span><i class="fas fa-times" color="red"></i></span></button>';
        multi += '<button class="btn btn-secondary disabled" type="button"><span>Admin</span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="admin" data-permission="yes"><span><i class="fas fa-check" color="green"></i></span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="admin" data-permission="no"><span><i class="fas fa-times" color="red"></i></span></button>';
        multi += '</div>';

        multi_warning += '<div class="dt-buttons btn-group float-right d-none custom-permissions-warning">';
        multi_warning += '<button class="btn btn-warning bg-warning text-dark" type="button"><span><i class="fas fa-exclamation-triangle"></i> Er zijn niet-bewaarde aanpassingen</span></button>';
        multi_warning += '</div>';

        multi += multi_warning;

        multi += '</div>';

        $('div#rights_wrapper').prepend(multi);
        $('div#rights_info').after(multi_warning);


        // click select all
        $('button#custom-permissions-select-all').on('click', function(){
            $('table#rights tbody tr').each(function(){
                $(this).addClass('row-selected');
            });
        });
        // click select all (no admin)
        $('button#custom-permissions-select-all-no-admin').on('click', function(){
            $('table#rights tbody tr').each(function(){
                if($(this).attr('id').indexOf('admin') !== -1)
                {
                    $(this).removeClass('row-selected');
                }
                else
                {
                    $(this).addClass('row-selected');
                }
            });
        });
        // click select users
        $('button#custom-permissions-select-users').on('click', function(){
            $('table#rights tbody tr').each(function(){
                if($(this).attr('id').indexOf(':users') !== -1)
                {
                    $(this).addClass('row-selected');
                }
                else
                {
                    $(this).removeClass('row-selected');
                }
            });
        });


        // click permission
        var waiting = 150;
        var index;
        var items;

        var type;
        var permission;
        var permission_cell;
        var permission_minus = false;
        var select;

        $('button.custom-multi-permission').on('click', function(){

            // save permission information
            type = $(this).attr('data-type')
            permission = $(this).attr('data-permission');


            // save items
            items = [];
            index = 0;

            $('table#rights tr.row-selected').each(function(){
                items[index++] = $(this);
            });


            // loop items
            $.each(items, function(i){

                setTimeout(function(){

                    // type
                    switch(type)
                    {
                        case 'access':
                            permission_cell = items[i].find('td:nth-child(3)');
                            permission_minus = items[i].find('td:nth-child(3) svg.fa-minus').length;
                            permission_cell.click();
                            select = items[i].find('select#DTE_Field_read');
                            break;

                        case 'edit':
                            permission_cell = items[i].find('td:nth-child(4)');
                            permission_minus = items[i].find('td:nth-child(4) svg.fa-minus').length;
                            permission_cell.click();
                            select = items[i].find('select#DTE_Field_write');
                            break;

                        case 'admin':
                            permission_cell = items[i].find('td:nth-child(5)');
                            permission_minus = items[i].find('td:nth-child(5) svg.fa-minus').length;
                            permission_cell.click();
                            select = items[i].find('select#DTE_Field_admin');
                            break;
                    }

                    // permission
                    switch(permission)
                    {
                        case 'yes':
                            select.val('true').change();
                            break;

                        case 'no':
                            if(permission_minus)
                            {
                                select.val('true').change();
                                setTimeout(function(){
                                    $('#custom-permissions-apply').click();
                                    permission_cell.click();
                                    select.val('false').change();
                                }, 50);
                            }
                            else
                            {
                                select.val('false').change();
                            }
                            break;
                    }

                    setTimeout(function(){
                        $('#custom-permissions-apply').click();
                        $('.custom-permissions-warning').removeClass('d-none');
                    }, 100);

                }, waiting * i);

            });
        });

        $('button#save').on('click', function(){
            $('.custom-permissions-warning').addClass('d-none');
        });


        // allowed devices

        // numbers: completed + errored
        var desk_numbers = '';
        desk_numbers += '<span class="custom_desks_reload_all_number">';
        desk_numbers += '<span id="custom_desks_checked" style="color: gray;">';
        desk_numbers += '<i class="fas fa-check-circle" style="margin-left: 5xp;"></i>';
        desk_numbers += ' <span id="custom_desks_checked_number">0</span>/'+Object.keys(dw_desks).length;
        desk_numbers += '</span>';
        desk_numbers += '<span id="custom_desks_error" style="color: gray;">';
        desk_numbers += '<i class="fas fa-circle" style="margin-left: 5px;"></i>';
        desk_numbers += ' <span id="custom_desks_error_number">0</span>';
        desk_numbers += '</span>';
        desk_numbers += '<button id="custom_desks_check" class="btn" style="color: green;"><i class="far fa-play-circle"></i> Get device information</button>';
        desk_numbers += '</span>';
        $('fieldset[data-source-property="whitelist"] legend').append(desk_numbers);

        $('#custom_desks_check').on('click', function(){

            $('#custom_desks_check').hide();
            $('#custom_desks_checked').attr('style','color: green;');
            $('#custom_desks_error').attr('style','color: red;');

            // all devices
            var all_devices = '';
            all_devices += '<div class="form-group">';
            all_devices += '<fieldset class="fieldset row border-success" data-source-property="alllist">';
            all_devices += '<legend class="legend" data-source-property="alllist"><button class="btn" type="button" data-toggle="collapse" data-target=".collapse-alllist" aria-expanded="false" aria-controls="collapse-allist"><span class="fa fal fa-plus"></span></button> All devices list</legend>';
            all_devices += '<div class="subitem container collapse-alllist collapse">';
            all_devices += '<div id="alloweddevices_alllist_wrapper" class="dataTables_wrapper dt-bootstrap4 no-footer">';
            all_devices += '<table class="table datatable dataTable no-footer dtr-inline text-left" width="100%" id="alloweddevices_alllist" role="grid" style="width: 100%">';
            all_devices += '<thead><tr role="row"><th class="" style="color: green;">Mac Address</th><th class="" style="color: green;">Name</th></tr></thead>';
            all_devices += '<tbody></tbody>';
            all_devices += '</table>';
            all_devices += '</div>';
            all_devices += '</div>';
            all_devices += '</fieldset>';
            all_devices += '</div>';

            $('fieldset[data-source-property="whitelist"]').parent().after(all_devices);


            $('table#alloweddevices_whitelist').find('> thead > tr > th:nth-child(2)').after('<th style="color: green; width: auto;">Name</th>');

            $('table#alloweddevices_whitelist tbody tr').each(function(){

                // add extra column for device
                if($(this).find('td').length == 2)
                {
                    $(this).find('td:nth-child(2)').after('<td></td>');
                }
            });

            // loop all devices
            var desks_mac = [];


            $.each(dw_desks, function(id, desk) {

                const obj = {
                    id
                }
                $.ajax({
                    method: 'POST',
                    url: '/api/dwinfo',
                    xhrFields: { withCredentials: true },
                    contentType: 'json',
                    data: JSON.stringify(obj),
                    success: function(data, textStatus, jqXHR) {

                        try
                        {
                            if(data.length > 2)
                            {
                                // only parse if no empty ("") response

                                // extra error check
                                //  \"}\n{\"max\":1,\"count\":2,\"id\":\"X.X.X.X\",\"response\":\"
                                if(data.indexOf('\\"max\\":1,\\"count\\":2,') !== -1)
                                {
                                    // error found in string
                                    //  extra response (split)

                                    // remove extra response information from string
                                    data = data.replaceAll('\\"}\\n{\\"max\\":1,\\"count\\":2,\\"id\\":\\"'+id+'\\",\\"response\\":\\"','');
                                }


                                var dataObject = JSON.parse(data);
                                var deskwallInfo = (typeof dataObject === 'string') ? JSON.parse(dataObject) : dataObject;

                                if (Array.isArray(dataObject) && dataObject.length > 0) {
                                    dataObject.some(item => {
                                        const itemObject = (typeof item === 'string') ? JSON.parse(item) : item;
                                        if (itemObject && itemObject.id === id) {
                                            deskwallInfo = itemObject;
                                        }
                                    });
                                }

                                if (deskwallInfo && deskwallInfo.response) {
                                    var response = JSON.parse(deskwallInfo.response);

                                    if(response.dwinfo.device.dw_code && response.dwinfo.device.host)
                                    {
                                        var mac = response.dwinfo.device.dw_code.replaceAll(':','');

                                        // add host to allowed devices
                                        $('table#alloweddevices_whitelist tbody tr#'+mac+' td:nth-child(3)').attr('style','color: green;').html(response.dwinfo.device.host);

                                        // add host to all devices
                                        $('table#alloweddevices_alllist tbody').append('<tr><td style="color: green;">'+response.dwinfo.device.dw_code+'</td><td style="color: green;">'+response.dwinfo.device.host+'</td></tr>');

                                        // update number of checked devices
                                        var desks_checked = $('span#custom_desks_checked_number').text();
                                        $('span#custom_desks_checked_number').text(++desks_checked);

                                    }
                                }
                            }
                            else
                            {
                                // update number of errored devices
                                var desks_error = $('span#custom_desks_error_number').text();
                                $('span#custom_desks_error_number').text(++desks_error);
                            }
                        }
                        catch(err)
                        {

                        }
                    },
                    error: function(xhr)
                    {
                        // update number of errored devices
                        var desks_error = $('span#custom_desks_error_number').text();
                        $('span#custom_desks_error_number').text(++desks_error);
                    }
                });
            });

        });

        // move article element to top
        editConfigSourcesArticle();
    }
}
function editConfigSourcesOverview()
{
    $('table#sources-table').find('> tbody > tr > td:nth-child(2)').addClass('text-center');

    var type;

    $('table#sources-table tbody tr').each(function(){

        // add extra column for name
        if($(this).find('td').length == 5)
        {
            $(this).find('td:nth-child(5)').after('<td></td><td></td>');
        }

        var id = $(this).attr('id');

        var type_cell = $(this).find('td:nth-child(4)');
        var menu_cell = $(this).find('td:nth-child(6)');
        var whitelist_cell = $(this).find('td:nth-child(7)');

        // type
        type = '';

        if(type == '' && type_cell.attr('data-text') !== undefined)
        {
            type = type_cell.attr('data-text');
        }
        if(type == '')
        {
            type = type_cell.text();
            type_cell.attr('data-text', type_cell.text());
        }

        type_cell.html('<span class="custom-tag-role custom-tag-role-sentinel">'+type+'</span>');


        $.ajax({
            method: 'GET',
            url: '/api/apps/' + id,
            xhrFields: { withCredentials: true },
            contentType: 'application/json',
            datatype: 'json',
            success: function(data, textStatus, jqXHR) {

                if ("string" == typeof data && data)
                {
                    data = JSON.parse(data);

                    if (data && data.id && (data.id.toLowerCase() == id.toLowerCase()))
                    {
                        // encoder multihead | number of encoders
                        if(data.dwrt_list !== undefined)
                        {
                            var dwrt_list = '<span class="custom-tag-role custom-tag-role-sentinel" title="Encoders: '+data.dwrt_list.length+'">'+data.dwrt_list.length+'</span>';

                            type_cell.html(type_cell.html() + dwrt_list);
                        }

                        // encoder | webui
                        if(data.raritanmodel !== undefined && data.host !== undefined)
                        {
                            var dwrt_link = ' <a href="https://'+data.host+'/" target="_blank"><i class="far fa-external-link-alt mx-1" style="color: orange;" title="Open WebUI"></i></a>';

                            type_cell.html(type_cell.html() + dwrt_link);
                        }

                        // encoder | part of multihead
                        if(data.dwrt_multimonitor !== undefined && data.dwrt_multimonitor.dwrt_ismultihead !== undefined)
                        {
                            var dwrt_partofmultihead = '';

                            if(data.dwrt_multimonitor.dwrt_ismultihead == true)
                            {
                                dwrt_partofmultihead = ' <i class="fas fa-columns mx-1" style="color: green;" title="Encoder: deel van multihead"></i>';
                            }
                            else
                            {
                                dwrt_partofmultihead = ' <i class="fas fa-columns mx-1" style="color: lightgrey;" title="Encoder: geen deel van multihead"></i>';
                            }

                            type_cell.html(type_cell.html() + dwrt_partofmultihead);
                        }


                        // encoder | mouse
                        if(data.hideremotecursor !== undefined)
                        {
                            var dwrt_mouse = '';

                            if(data.hideremotecursor == false)
                            {
                                dwrt_mouse = ' <i class="fas fa-mouse-pointer mx-1 float-right" style="color: green;" title="DeskWall muis: tonen"></i>';
                            }
                            else
                            {
                                dwrt_mouse = ' <i class="fas fa-mouse-pointer mx-1 float-right" style="color: lightgrey;" title="DeskWall muis: verborgen"></i>';
                            }

                            type_cell.html(type_cell.html() + dwrt_mouse);
                        }

                        // encoder | opengl
                        if(data.dwrt_noopengl !== undefined)
                        {
                            var dwrt_opengl = '';

                            if(data.dwrt_noopengl == false)
                            {
                                dwrt_opengl = ' <i class="far fa-image mx-1 float-right" style="color: green;" title="OpenGL: actief"></i>';
                            }
                            else
                            {
                                dwrt_opengl = ' <i class="far fa-image mx-1 float-right" style="color: lightgrey;" title="OpenGL: inactief"></i>';
                            }

                            type_cell.html(type_cell.html() + dwrt_opengl);
                        }

                        // all | view only
                        if(data.status !== undefined && data.status.viewonly !== undefined)
                        {
                            var viewonly = '';

                            if(data.status.viewonly == true)
                            {
                                viewonly = ' <i class="far fa-eye mx-1" style="color: #FFC107;" title="View only"></i>';
                            }

                            type_cell.html(type_cell.html() + viewonly);
                        }

                        // all | menu
                        if(data.showmenu !== undefined)
                        {
                            var menu_icon = '';

                            if(data.showmenu)
                            {
                                menu_icon = '<i class="fas fa-check-circle" style="color: green;" title="Tonen in menu"></i>';
                            }
                            else
                            {
                                menu_icon = '<i class="fas fa-times-circle" style="color: lightgray;" title="Niet tonen in menu"></i>';
                            }

                            menu_cell.html(menu_icon);
                        }

                        // all | whitelisted
                        if(data.alloweddevices !== undefined && data.alloweddevices.whitelist !== undefined &&  data.alloweddevices.whitelist.length > 0)
                        {
                            whitelist_cell.html('<i class="fas fa-exclamation-circle" style="color: red;" title="Whitelisted: '+data.alloweddevices.whitelist.length+'"></i><sup style="color: red;">'+data.alloweddevices.whitelist.length+'</sup>');
                        }

                        // all | blacklisted
                        if(data.alloweddevices !== undefined && data.alloweddevices.blacklist !== undefined &&  data.alloweddevices.blacklist.length > 0)
                        {
                            whitelist_cell.html('<i class="fas fa-exclamation-circle" style="color: black;" title="Blacklisted: '+data.alloweddevices.blacklist.length+'"></i><sup style="color: black;">'+data.alloweddevices.blacklist.length+'</sup>');
                        }
                    }
                }
            }
        });
    });
}

// ***********************************************
// Edit Config Tool Sources Article
// ***********************************************
function editConfigSourcesArticle()
{
    // move article element
    var article_element;
    var article_container;

    var articles = [
        'action',
        'chrome',
        'dwrt101',
        'dwrtmultihead',
        'rdp',
        'rtsp',
        'vmware',
        'vnc',
        'vncreal'
    ];

    // source: auto open
    $.each(articles, function(index, article){
        if($('fieldset[data-source-property="'+article+'"]').length)
        {
            article_element = $('fieldset[data-source-property="'+article+'"]');
        }
    });

    article_container = article_element.parent();
    article_element.prependTo(article_container);

    article_element.find('button').click();
    article_element.addClass('border-success');
}

// ***********************************************
// Edit Config Tool Actions
// ***********************************************
function editConfigActions()
{
    // overview
    if($('div#actions').length)
    {
        // table(s): optimize
        $('table#actions-table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 50px;').addClass('text-center');
        $('table#actions-table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: auto;');
        $('table#actions-table').find('> thead > tr > th:nth-child(4)').attr('style', 'width: 20px;');


        // actionss: icons
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation){
                if(mutation.type === 'childList' && mutation.addedNodes.length)
                {
                    editConfigActionsOverview();
                }
            });
        });
        observer.observe($('table#actions-table tbody')[0], {childList: true});

        editConfigActionsOverview();
    }


    // single
    else if($('div#article').length)
    {
        // table(s): optimize
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: auto;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(3)').attr('style', 'width: 100px;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(4)').attr('style', 'width: 100px;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(5)').attr('style', 'width: 100px;');


        // permissions: auto open
        $('fieldset[data-source-property="rights"]').find('legend > button').click();
        $('fieldset[data-source-property="rights"]').addClass('border-success');


        // create buttons
        var multi = '';
        var multi_warning = '';

        multi += '<div class="flexrow">';

        multi += '<div class="dt-buttons btn-group">';
        multi += '<button class="btn btn-success bg-success text-light" type="button" id="custom-permissions-select-all" title="Select all"><span><i class="fas fa-check-square"></i></span></button>';
        multi += '<button class="btn btn-warning bg-warning text-dark" type="button" id="custom-permissions-select-all-no-admin" title="Select all but admins"><span><i class="far fa-check-square"></i></span></button>';
        multi += '<button class="btn btn-warning bg-warning text-dark" type="button" id="custom-permissions-select-users" title="Select users"><span><i class="far fa-check-square"></i></span></button>';
        multi += '<button class="btn btn-secondary d-none" type="button" id="custom-permissions-apply"><span>Apply</span></button>';
        multi += '<button class="btn btn-secondary disabled" type="button"><span>Access</span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="access" data-permission="yes"><span><i class="fas fa-check" color="green"></i></span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="access" data-permission="no"><span><i class="fas fa-times" color="red"></i></span></button>';
        multi += '<button class="btn btn-secondary disabled" type="button"><span>Edit</span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="edit" data-permission="yes"><span><i class="fas fa-check" color="green"></i></span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="edit" data-permission="no"><span><i class="fas fa-times" color="red"></i></span></button>';
        multi += '<button class="btn btn-secondary disabled" type="button"><span>Admin</span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="admin" data-permission="yes"><span><i class="fas fa-check" color="green"></i></span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="admin" data-permission="no"><span><i class="fas fa-times" color="red"></i></span></button>';
        multi += '</div>';

        multi_warning += '<div class="dt-buttons btn-group float-right d-none custom-permissions-warning">';
        multi_warning += '<button class="btn btn-warning bg-warning text-dark" type="button"><span><i class="fas fa-exclamation-triangle"></i> Er zijn niet-bewaarde aanpassingen</span></button>';
        multi_warning += '</div>';

        multi += multi_warning;

        multi += '</div>';

        $('div#rights_wrapper').prepend(multi);
        $('div#rights_info').after(multi_warning);


        // click select all
        $('button#custom-permissions-select-all').on('click', function(){
            $('table#rights tbody tr').each(function(){
                $(this).addClass('row-selected');
            });
        });
        // click select all (no admin)
        $('button#custom-permissions-select-all-no-admin').on('click', function(){
            $('table#rights tbody tr').each(function(){
                if($(this).attr('id').indexOf('admin') !== -1)
                {
                    $(this).removeClass('row-selected');
                }
                else
                {
                    $(this).addClass('row-selected');
                }
            });
        });
        // click select users
        $('button#custom-permissions-select-users').on('click', function(){
            $('table#rights tbody tr').each(function(){
                if($(this).attr('id').indexOf(':users') !== -1)
                {
                    $(this).addClass('row-selected');
                }
                else
                {
                    $(this).removeClass('row-selected');
                }
            });
        });


        // click permission
        var waiting = 150;
        var index;
        var items;

        var type;
        var permission;
        var permission_cell;
        var permission_minus = false;
        var select;

        $('button.custom-multi-permission').on('click', function(){

            // save permission information
            type = $(this).attr('data-type')
            permission = $(this).attr('data-permission');


            // save items
            items = [];
            index = 0;

            $('table#rights tr.row-selected').each(function(){
                items[index++] = $(this);
            });


            // loop items
            $.each(items, function(i){

                setTimeout(function(){

                    // type
                    switch(type)
                    {
                        case 'access':
                            permission_cell = items[i].find('td:nth-child(3)');
                            permission_minus = items[i].find('td:nth-child(3) svg.fa-minus').length;
                            permission_cell.click();
                            select = items[i].find('select#DTE_Field_read');
                            break;

                        case 'edit':
                            permission_cell = items[i].find('td:nth-child(4)');
                            permission_minus = items[i].find('td:nth-child(4) svg.fa-minus').length;
                            permission_cell.click();
                            select = items[i].find('select#DTE_Field_write');
                            break;

                        case 'admin':
                            permission_cell = items[i].find('td:nth-child(5)');
                            permission_minus = items[i].find('td:nth-child(5) svg.fa-minus').length;
                            permission_cell.click();
                            select = items[i].find('select#DTE_Field_admin');
                            break;
                    }

                    // permission
                    switch(permission)
                    {
                        case 'yes':
                            select.val('true').change();
                            break;

                        case 'no':
                            if(permission_minus)
                            {
                                select.val('true').change();
                                setTimeout(function(){
                                    $('#custom-permissions-apply').click();
                                    permission_cell.click();
                                    select.val('false').change();
                                }, 50);
                            }
                            else
                            {
                                select.val('false').change();
                            }
                            break;
                    }

                    setTimeout(function(){
                        $('#custom-permissions-apply').click();
                        $('.custom-permissions-warning').removeClass('d-none');
                    }, 100);

                }, waiting * i);

            });
        });

        $('button#save').on('click', function(){
            $('.custom-permissions-warning').addClass('d-none');
        });
    }
}
function editConfigActionsOverview()
{
    $('table#actions-table').find('> tbody > tr > td:nth-child(1)').addClass('text-center');
}

// ***********************************************
// Edit Config Tool Menus
// ***********************************************
function editConfigMenus()
{
    // overview
    if($('div#menus').length)
    {
        // table(s): optimize
        $('table#menus-table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('table#menus-table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: 50px;').addClass('text-center');
        $('table#menus-table').find('> thead > tr > th:nth-child(3)').attr('style', 'width: auto;');
        $('table#menus-table').find('> thead > tr > th:nth-child(5)').attr('style', 'width: 75px;');
        $('table#menus-table').find('> thead > tr > th:nth-child(6)').attr('style', 'width: 20px;');


        // menus: icons
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation){
                if(mutation.type === 'childList' && mutation.addedNodes.length)
                {
                    editConfigMenusOverview();
                }
            });
        });
        observer.observe($('table#menus-table tbody')[0], {childList: true});

        editConfigMenusOverview();
    }


    // single
    else if($('div#article').length)
    {
        // table(s): optimize
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: auto;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(3)').attr('style', 'width: 100px;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(4)').attr('style', 'width: 100px;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(5)').attr('style', 'width: 100px;');

        $('div#items_wrapper table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('div#items_wrapper table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: 100px;');
        $('div#items_wrapper table').find('> thead > tr > th:nth-child(3)').attr('style', 'width: auto;');
        $('div#items_wrapper table').find('> thead > tr > th:nth-child(4)').attr('style', 'width: 20px;');

       // permissions: auto open?
        if(localStorage.getItem('dw_menus_permissions_auto_open') === '1')
        {
            localStorage.setItem('dw_menus_permissions_auto_open_script', '1');

            $('fieldset[data-source-property="rights"] button').click();
            $('fieldset[data-source-property="rights"]').addClass('border-success');

            localStorage.setItem('dw_menus_permissions_auto_open_script', '0');
        }

        // permissions: save auto open
        $('fieldset[data-source-property="rights"] button').on('click', function(){

            if(localStorage.getItem('dw_menus_permissions_auto_open_script') === null || localStorage.getItem('dw_menus_permissions_auto_open_script') === '0')
            {
                if($(this).attr('aria-expanded') === 'true')
                {
                    localStorage.setItem('dw_menus_permissions_auto_open', '0');
                }
                else
                {
                    localStorage.setItem('dw_menus_permissions_auto_open', '1');
                }

                $('fieldset[data-source-property="rights"]').removeClass('border-success');
            }
            else
            {
                localStorage.setItem('dw_menus_permissions_auto_open_script', '0');
            }
        });



        // create buttons
        var multi = '';
        var multi_warning = '';

        multi += '<div class="flexrow">';

        multi += '<div class="dt-buttons btn-group">';
        multi += '<button class="btn btn-success bg-success text-light" type="button" id="custom-permissions-select-all" title="Select all"><span><i class="fas fa-check-square"></i></span></button>';
        multi += '<button class="btn btn-warning bg-warning text-dark" type="button" id="custom-permissions-select-all-no-admin" title="Select all but admins"><span><i class="far fa-check-square"></i></span></button>';
        multi += '<button class="btn btn-warning bg-warning text-dark" type="button" id="custom-permissions-select-users" title="Select users"><span><i class="far fa-check-square"></i></span></button>';
        multi += '<button class="btn btn-secondary disabled" type="button"><span>Access</span></button>';
        multi += '<button class="btn btn-secondary d-none" type="button" id="custom-permissions-apply"><span>Apply</span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="access" data-permission="yes"><span><i class="fas fa-check" color="green"></i></span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="access" data-permission="no"><span><i class="fas fa-times" color="red"></i></span></button>';
        multi += '<button class="btn btn-secondary disabled" type="button"><span>Edit</span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="edit" data-permission="yes"><span><i class="fas fa-check" color="green"></i></span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="edit" data-permission="no"><span><i class="fas fa-times" color="red"></i></span></button>';
        multi += '<button class="btn btn-secondary disabled" type="button"><span>Admin</span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="admin" data-permission="yes"><span><i class="fas fa-check" color="green"></i></span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="admin" data-permission="no"><span><i class="fas fa-times" color="red"></i></span></button>';
        multi += '</div>';

        multi_warning += '<div class="dt-buttons btn-group float-right d-none custom-permissions-warning">';
        multi_warning += '<button class="btn btn-warning bg-warning text-dark" type="button"><span><i class="fas fa-exclamation-triangle"></i> Er zijn niet-bewaarde aanpassingen</span></button>';
        multi_warning += '</div>';

        multi += multi_warning;

        multi += '</div>';

        $('div#rights_wrapper').prepend(multi);
        $('div#rights_info').after(multi_warning);


        // click select all
        $('button#custom-permissions-select-all').on('click', function(){
            $('table#rights tbody tr').each(function(){
                $(this).addClass('row-selected');
            });
        });
        // click select all (no admin)
        $('button#custom-permissions-select-all-no-admin').on('click', function(){
            $('table#rights tbody tr').each(function(){
                if($(this).attr('id').indexOf('admin') !== -1)
                {
                    $(this).removeClass('row-selected');
                }
                else
                {
                    $(this).addClass('row-selected');
                }
            });
        });
        // click select users
        $('button#custom-permissions-select-users').on('click', function(){
            $('table#rights tbody tr').each(function(){
                if($(this).attr('id').indexOf(':users') !== -1)
                {
                    $(this).addClass('row-selected');
                }
                else
                {
                    $(this).removeClass('row-selected');
                }
            });
        });


        // click permission
        var waiting = 150;
        var index;
        var items;

        var type;
        var permission;
        var permission_cell;
        var permission_minus = false;
        var select;

        $('button.custom-multi-permission').on('click', function(){

            // save permission information
            type = $(this).attr('data-type')
            permission = $(this).attr('data-permission');


            // save items
            items = [];
            index = 0;

            $('table#rights tr.row-selected').each(function(){
                items[index++] = $(this);
            });


            // loop items
            $.each(items, function(i){

                setTimeout(function(){

                    // type
                    switch(type)
                    {
                        case 'access':
                            permission_cell = items[i].find('td:nth-child(3)');
                            permission_minus = items[i].find('td:nth-child(3) svg.fa-minus').length;
                            permission_cell.click();
                            select = items[i].find('select#DTE_Field_read');
                            break;

                        case 'edit':
                            permission_cell = items[i].find('td:nth-child(4)');
                            permission_minus = items[i].find('td:nth-child(4) svg.fa-minus').length;
                            permission_cell.click();
                            select = items[i].find('select#DTE_Field_write');
                            break;

                        case 'admin':
                            permission_cell = items[i].find('td:nth-child(5)');
                            permission_minus = items[i].find('td:nth-child(5) svg.fa-minus').length;
                            permission_cell.click();
                            select = items[i].find('select#DTE_Field_admin');
                            break;
                    }

                    // permission
                    switch(permission)
                    {
                        case 'yes':
                            select.val('true').change();
                            break;

                        case 'no':
                            if(permission_minus)
                            {
                                select.val('true').change();
                                setTimeout(function(){
                                    $('#custom-permissions-apply').click();
                                    permission_cell.click();
                                    select.val('false').change();
                                }, 50);
                            }
                            else
                            {
                                select.val('false').change();
                            }
                            break;
                    }

                    setTimeout(function(){
                        $('#custom-permissions-apply').click();
                        $('.custom-permissions-warning').removeClass('d-none');
                    }, 100);

                }, waiting * i);

            });
        });

        $('button#save').on('click', function(){
            $('.custom-permissions-warning').addClass('d-none');
        });


        // menu items: auto open
        $('fieldset[data-source-property="items"]').find('> legend > button').click();
        $('fieldset[data-source-property="items"]').addClass('border-success');

        // menu items: breadcrumb restyle
        var breadcrumb_el = $('fieldset[data-source-property="items"] div.form-group div.container:first-of-type');
        var breadcrumb = '';
        var breadcrumb_i = 0;

        var input_path = $('input#path');
        var input_parentnames = $('input#parentnames');

        breadcrumb += '<div class="dt-buttons btn-group mb-3">';

        breadcrumb_el.find('a').each(function(){
            if(breadcrumb_i++ > 0)
            {
                breadcrumb += '<button class="btn btn-secondary disabled" type="button"><span><i class="fas fa-caret-right"></i></span></button>';
            }

            breadcrumb += '<button class="btn btn-success" type="button"><a href="'+$(this).attr('href')+'" class="text-success">'+$(this).text()+'</a></button>';
        });

        breadcrumb_el.html(breadcrumb).append(input_path).append(input_parentnames);
    }
}
function editConfigMenusOverview()
{
    $('table#menus-table').find('> tbody > tr > td:nth-child(2)').addClass('text-center');


    var type;
    var tag;

    $('table#menus-table').find('> tbody > tr > td:nth-child(4)').each(function(){
        type = $(this).text();

        switch(type.toLowerCase())
        {
            case 'menu':
                tag = '<span class="custom-tag-role custom-tag-role-master">menu</span>';
                break;

            case 'static':
                tag = '<span class="custom-tag-role custom-tag-role-sentinel">static</span>';
                break;
        }

        $(this).html(tag);
    });

}

// ***********************************************
// Edit Config Tool Sessions
// ***********************************************
function editConfigSessions()
{
    // overview
    if($('div#session').length)
    {
        // table(s): optimize
        $('table#session-table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('table#session-table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: 50px;').addClass('text-center');
        $('table#session-table').find('> thead > tr > th:nth-child(3)').attr('style', 'width: 250px;');
        $('table#session-table').find('> thead > tr > th:nth-child(4)').attr('style', 'width: auto;');
        $('table#session-table').find('> thead > tr > th:nth-child(5)').attr('style', 'width: 250px;');
        $('table#session-table').find('> thead > tr > th:nth-child(6)').attr('style', 'width: 20px;');


        // menus: icons
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation){
                if(mutation.type === 'childList' && mutation.addedNodes.length)
                {
                    editConfigSessionsOverview();
                }
            });
        });
        observer.observe($('table#session-table tbody')[0], {childList: true});

        editConfigSessionsOverview();
    }


    // single
    else if($('div#article').length)
    {
        // table(s): optimize
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: auto;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(3)').attr('style', 'width: 100px;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(4)').attr('style', 'width: 100px;');
        $('div#rights_wrapper table').find('> thead > tr > th:nth-child(5)').attr('style', 'width: 100px;');

        $('table#session_apps_ro').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 100px;');
        $('table#session_apps_ro').find('> thead > tr > th:nth-child(2)').attr('style', 'width: auto;');
        $('table#session_apps_ro').find('> thead > tr > th:nth-child(3)').attr('style', 'width: 50px;');
        $('table#session_apps_ro').find('> thead > tr > th:nth-child(4)').attr('style', 'width: 50px;');
        $('table#session_apps_ro').find('> thead > tr > th:nth-child(5)').attr('style', 'width: 50px;');
        $('table#session_apps_ro').find('> thead > tr > th:nth-child(6)').attr('style', 'width: 50px;');

       // permissions: auto open?
        if(localStorage.getItem('dw_menus_permissions_auto_open') === '1')
        {
            localStorage.setItem('dw_menus_permissions_auto_open_script', '1');

            $('fieldset[data-source-property="rights"] button').click();
            $('fieldset[data-source-property="rights"]').addClass('border-success');

            localStorage.setItem('dw_menus_permissions_auto_open_script', '0');
        }

        // permissions: save auto open
        $('fieldset[data-source-property="rights"] button').on('click', function(){

            if(localStorage.getItem('dw_menus_permissions_auto_open_script') === null || localStorage.getItem('dw_menus_permissions_auto_open_script') === '0')
            {
                if($(this).attr('aria-expanded') === 'true')
                {
                    localStorage.setItem('dw_menus_permissions_auto_open', '0');
                }
                else
                {
                    localStorage.setItem('dw_menus_permissions_auto_open', '1');
                }

                $('fieldset[data-source-property="rights"]').removeClass('border-success');
            }
            else
            {
                localStorage.setItem('dw_menus_permissions_auto_open_script', '0');
            }
        });


        // create buttons
        var multi = '';
        var multi_warning = '';

        multi += '<div class="flexrow">';

        multi += '<div class="dt-buttons btn-group">';
        multi += '<button class="btn btn-success bg-success text-light" type="button" id="custom-permissions-select-all" title="Select all"><span><i class="fas fa-check-square"></i></span></button>';
        multi += '<button class="btn btn-warning bg-warning text-dark" type="button" id="custom-permissions-select-all-no-admin" title="Select all but admins"><span><i class="far fa-check-square"></i></span></button>';
        multi += '<button class="btn btn-warning bg-warning text-dark" type="button" id="custom-permissions-select-users" title="Select users"><span><i class="far fa-check-square"></i></span></button>';
        multi += '<button class="btn btn-secondary d-none" type="button" id="custom-permissions-apply"><span>Apply</span></button>';
        multi += '<button class="btn btn-secondary disabled" type="button"><span>Access</span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="access" data-permission="yes"><span><i class="fas fa-check" color="green"></i></span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="access" data-permission="no"><span><i class="fas fa-times" color="red"></i></span></button>';
        multi += '<button class="btn btn-secondary disabled" type="button"><span>Edit</span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="edit" data-permission="yes"><span><i class="fas fa-check" color="green"></i></span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="edit" data-permission="no"><span><i class="fas fa-times" color="red"></i></span></button>';
        multi += '<button class="btn btn-secondary disabled" type="button"><span>Admin</span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="admin" data-permission="yes"><span><i class="fas fa-check" color="green"></i></span></button>';
        multi += '<button class="btn btn-success custom-multi-permission" type="button" data-type="admin" data-permission="no"><span><i class="fas fa-times" color="red"></i></span></button>';
        multi += '</div>';

        multi_warning += '<div class="dt-buttons btn-group float-right d-none custom-permissions-warning">';
        multi_warning += '<button class="btn btn-warning bg-warning text-dark" type="button"><span><i class="fas fa-exclamation-triangle"></i> Er zijn niet-bewaarde aanpassingen</span></button>';
        multi_warning += '</div>';

        multi += multi_warning;

        multi += '</div>';

        $('div#rights_wrapper').prepend(multi);
        $('div#rights_info').after(multi_warning);


        // click select all
        $('button#custom-permissions-select-all').on('click', function(){
            $('table#rights tbody tr').each(function(){
                $(this).addClass('row-selected');
            });
        });
        // click select all (no admin)
        $('button#custom-permissions-select-all-no-admin').on('click', function(){
            $('table#rights tbody tr').each(function(){
                if($(this).attr('id').indexOf('admin') !== -1)
                {
                    $(this).removeClass('row-selected');
                }
                else
                {
                    $(this).addClass('row-selected');
                }
            });
        });
        // click select users
        $('button#custom-permissions-select-users').on('click', function(){
            $('table#rights tbody tr').each(function(){
                if($(this).attr('id').indexOf(':users') !== -1)
                {
                    $(this).addClass('row-selected');
                }
                else
                {
                    $(this).removeClass('row-selected');
                }
            });
        });


        // click permission
        var waiting = 150;
        var index;
        var items;

        var type;
        var permission;
        var permission_cell;
        var permission_minus = false;
        var select;

        $('button.custom-multi-permission').on('click', function(){

            // save permission information
            type = $(this).attr('data-type')
            permission = $(this).attr('data-permission');


            // save items
            items = [];
            index = 0;

            $('table#rights tr.row-selected').each(function(){
                items[index++] = $(this);
            });


            // loop items
            $.each(items, function(i){

                setTimeout(function(){

                    // type
                    switch(type)
                    {
                        case 'access':
                            permission_cell = items[i].find('td:nth-child(3)');
                            permission_minus = items[i].find('td:nth-child(3) svg.fa-minus').length;
                            permission_cell.click();
                            select = items[i].find('select#DTE_Field_read');
                            break;

                        case 'edit':
                            permission_cell = items[i].find('td:nth-child(4)');
                            permission_minus = items[i].find('td:nth-child(4) svg.fa-minus').length;
                            permission_cell.click();
                            select = items[i].find('select#DTE_Field_write');
                            break;

                        case 'admin':
                            permission_cell = items[i].find('td:nth-child(5)');
                            permission_minus = items[i].find('td:nth-child(5) svg.fa-minus').length;
                            permission_cell.click();
                            select = items[i].find('select#DTE_Field_admin');
                            break;
                    }

                    // permission
                    switch(permission)
                    {
                        case 'yes':
                            select.val('true').change();
                            break;

                        case 'no':
                            if(permission_minus)
                            {
                                select.val('true').change();
                                setTimeout(function(){
                                    $('#custom-permissions-apply').click();
                                    permission_cell.click();
                                    select.val('false').change();
                                }, 50);
                            }
                            else
                            {
                                select.val('false').change();
                            }
                            break;
                    }

                    setTimeout(function(){
                        $('#custom-permissions-apply').click();
                        $('.custom-permissions-warning').removeClass('d-none');
                    }, 100);

                }, waiting * i);

            });
        });

        $('button#save').on('click', function(){
            $('.custom-permissions-warning').addClass('d-none');
        });


        // user: auto open
        $('fieldset[data-source-property="user"]').find('> legend > button').click();
        $('fieldset[data-source-property="user"]').addClass('> border-success');

        // session: auto open
        $('fieldset[data-source-property="session"]').find('> legend > button').click();
        $('fieldset[data-source-property="session"]').addClass('> border-success');

        // apps: auto open
        $('fieldset[data-source-property="apps_ro"]').find('> legend > button').click();
        $('fieldset[data-source-property="apps_ro"]').addClass('> border-success');
    }
}
function editConfigSessionsOverview()
{
    $('table#session-table').find('> tbody > tr > td:nth-child(2)').addClass('text-center');
}

// ***********************************************
// SUPPORT TOOL
// ***********************************************
function editSupport()
{
    // change background
    GM_addStyle('body, body header, body footer { background-color: #4A8B93 !important; }');

    // change button colors
    GM_addStyle('div#article button { background-color: #14B5BD !important; color: #FFFFFF !important; }');
    GM_addStyle('div#article button:hover { background-color: #27969B !important; }');

    // change button colors: SERVICES
    GM_addStyle('div#article button#launch-services { background-color: #28a745 !important; }');
    GM_addStyle('div#article button#stop-services { background-color: #dc3545 !important; }');
    GM_addStyle('div#article button#reload-services { background-color: #C39408 !important; }');

    GM_addStyle('#support-services-table a svg.fa-play { color: #28a745 !important; }');
    GM_addStyle('#support-services-table a svg.fa-stop { color: #dc3545 !important; }');
    GM_addStyle('#support-services-table a svg.fa-sync { color: #C39408 !important; }');

    // change button colors: DATABASE
    GM_addStyle('div#article button#launch-redis-service { background-color: #28a745 !important; }');
    GM_addStyle('div#article button#stop-redis-service { background-color: #dc3545 !important; }');
    GM_addStyle('div#article button#reload-redis-services { background-color: #C39408 !important; }');

    GM_addStyle('#support-redis-services-table a svg.fa-play { color: #28a745 !important; }');
    GM_addStyle('#support-redis-services-table a svg.fa-stop { color: #dc3545 !important; }');
    GM_addStyle('#support-redis-services-table a svg.fa-sync { color: #C39408 !important; }');

    GM_addStyle('div#article button#remove-from-group { background-color: #C39408 !important; }');
    GM_addStyle('div#article button#fabric-restore { background-color: #C39408 !important; }');
    GM_addStyle('div#article button#clear-database { background-color: #dc3545 !important; }');

    // change button colors: PROCESS
    GM_addStyle('div#article button#stop-process { background-color: #dc3545 !important; }');
    GM_addStyle('div#article button#refresh-process { background-color: #C39408 !important; }');

    GM_addStyle('#support-process-table a svg.fa-stop { color: #dc3545 !important; }');


    // SERVICES
    if($('div#support-services').length)
    {
        // table(s): optimize
        $('table#support-services-table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('table#support-services-table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: auto;');
        $('table#support-services-table').find('> thead > tr > th:nth-child(5)').attr('style', 'width: 20px;');
        $('table#support-services-table').find('> thead > tr > th:nth-child(6)').attr('style', 'width: 20px;');
        $('table#support-services-table').find('> thead > tr > th:nth-child(7)').attr('style', 'width: 20px;');

        // services: tags
        var observer_services = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation){
                if(mutation.type === 'childList' && mutation.addedNodes.length)
                {
                    editSupportServicesOverview();
                }
            });
        });
        observer_services.observe($('table#support-services-table tbody')[0], {childList: true});

        editSupportServicesOverview();
    }

    // DATABASE
    if($('div#support-redis-services').length)
    {
        // table(s): optimize
        $('table#support-redis-services-table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('table#support-redis-services-table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: auto;');
        $('table#support-redis-services-table').find('> thead > tr > th:nth-child(5)').attr('style', 'width: 20px;');
        $('table#support-redis-services-table').find('> thead > tr > th:nth-child(6)').attr('style', 'width: 20px;');
        $('table#support-redis-services-table').find('> thead > tr > th:nth-child(7)').attr('style', 'width: 20px;');

        // database: tags
        var observer_database = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation){
                if(mutation.type === 'childList' && mutation.addedNodes.length)
                {
                    editSupportDatabaseOverview();
                }
            });
        });
        observer_database.observe($('table#support-redis-services-table tbody')[0], {childList: true});

        editSupportDatabaseOverview();
    }

    // LOGS
    if($('div#support-logs').length)
    {
        // table(s): optimize
        $('table#support-logs-table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('table#support-logs-table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: auto;');
        $('table#support-logs-table').find('> thead > tr > th:nth-child(5)').attr('style', 'width: 20px;');
        $('table#support-logs-table').find('> thead > tr > th:nth-child(6)').attr('style', 'width: 20px;');
        $('table#support-logs-table').find('> thead > tr > th:nth-child(7)').attr('style', 'width: 20px;');
        $('table#support-logs-table').find('> thead > tr > th:nth-child(8)').attr('style', 'width: 20px;');
    }

    // CONFIG
    if($('div#support-backups').length)
    {
        // table(s): optimize
        $('table#support-backups-table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('table#support-backups-table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: auto;');
        $('table#support-backups-table').find('> thead > tr > th:nth-child(5)').attr('style', 'width: 20px;');
    }

    // TOPICS
    if($('div#support-topics').length)
    {
        // table(s): optimize
        $('table#support-topics-table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 14px;');
        $('table#support-topics-table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: auto;');
        $('table#support-topics-table').find('> thead > tr > th:nth-child(4)').attr('style', 'width: 20px;');
    }

    // PROCESS
    if($('div#support-process').length)
    {
        // table(s): optimize
        $('table#support-process-table').find('> thead > tr > th:nth-child(1)').attr('style', 'width: 200px;');
        $('table#support-process-table').find('> thead > tr > th:nth-child(2)').attr('style', 'width: 100px;');
        $('table#support-process-table').find('> thead > tr > th:nth-child(3)').attr('style', 'width: 100px;');
        $('table#support-process-table').find('> thead > tr > th:nth-child(4)').attr('style', 'width: 100px;');
        $('table#support-process-table').find('> thead > tr > th:nth-child(5)').attr('style', 'width: 300px;');
        $('table#support-process-table').find('> thead > tr > th:nth-child(6)').attr('style', 'width: auto;');
        $('table#support-process-table').find('> thead > tr > th:nth-child(7)').attr('style', 'width: 20px;');
        $('table#support-process-table').find('> thead > tr > th:nth-child(8)').attr('style', 'width: 20px;');

        // process: tags
        var observer_process = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation){
                if(mutation.type === 'childList' && mutation.addedNodes.length)
                {
                    editSupportProcessOverview();
                }
            });
        });
        observer_process.observe($('table#support-process-table tbody')[0], {childList: true});

        editSupportProcessOverview();
    }
}
function editSupportServicesOverview()
{
    var status;
    var tag;

    $('table#support-services-table').find('> tbody > tr > td:nth-child(3)').each(function(){
        status = $(this).text();

        switch(status.toLowerCase())
        {
            case 'active':
                tag = '<span class="custom-tag-role custom-tag-state-active">active</span>';
                break;

            case 'inactive':
                tag = '<span class="custom-tag-role custom-tag-state-inactive">inactive</span>';
                break;
        }

        $(this).html(tag);
    });
}
function editSupportDatabaseOverview()
{
    var status;
    var tag;

    $('table#support-redis-services-table').find('> tbody > tr > td:nth-child(3)').each(function(){
        status = $(this).text();

        switch(status.toLowerCase())
        {
            case 'active':
                tag = '<span class="custom-tag-role custom-tag-state-active">active</span>';
                break;

            case 'inactive':
                tag = '<span class="custom-tag-role custom-tag-state-inactive">inactive</span>';
                break;
        }

        $(this).html(tag);
    });
}
function editSupportProcessOverview()
{
    var user;
    var context;
    var tag;

    $('table#support-process-table').find('> tbody > tr > td:nth-child(2)').each(function(){
        user = $(this).text();

        if(user.toLowerCase() == 'redis' || user.toLowerCase() == 'root')
        {
            tag = '<span class="custom-tag-role custom-tag-role-sentinel">'+user+'</span>';
        }
        else
        {
            tag = '<span class="custom-tag-role custom-tag-role-master">'+user+'</span>';
        }

        $(this).html(tag);
    });

    $('table#support-process-table').find('> tbody > tr > td:nth-child(4)').each(function(){
        context = $(this).text();

        switch(context.toLowerCase())
        {
            case 'root':
                tag = '<span class="custom-tag-role custom-tag-role-sentinel">'+context+'</span>';
                break;

            case 'user':
                tag = '<span class="custom-tag-role custom-tag-role-master">'+context+'</span>';
                break;
        }

        $(this).html(tag);
    });
}


// ***********************************************
// APITOOL
// ***********************************************
function editApitoolApi()
{
    var page_url = window.location.href;

    var page_apitool_api_triggers = page_url.indexOf('/apimanager/customtrigger') >= 0;
    var page_apitool_api_calls = page_url.indexOf('/apimanager/apicall') >= 0;
    var page_apitool_api_conns = page_url.indexOf('/apimanager/customconector') >= 0;
    var page_apitool_apps = page_url.indexOf('/conectorapp') >= 0;

    if(page_apitool_api_triggers)
    {
        $('legend:contains("API")').find('button').click();
        $('legend:contains("JSON")').find('button').click();
    }

    if(page_apitool_api_calls)
    {
        $('legend:contains("JSON")').find('button').click();
    }

    if(page_apitool_api_conns)
    {
        $('select#db_apicall_list').parents('div.input-group').css('height','500px');

        $('legend:contains("Relationship")').find('button').click();
    }
}


// ***********************************************
// APITOOL: highlight apps
// ***********************************************
function editApitoolApps()
{
    //editApitoolAppsCustomize();

    // Observer
    // +++++++++++++++++++++++++++++++++++++++++++
    var observer_config = {
        characterData: false,
        attributes: false,
        childList: true,
        subtree: false
    };

    var observer = new MutationObserver(function(mutations) {

        mutations.forEach(function(mutation){
            editApitoolAppsCustomize();
        });

    });

    $('table#customconector-table').find('> tbody').each(function(){
        observer.observe(this, observer_config);
    });


    editApitoolAppsCustomize();
}
function editApitoolAppsCustomize()
{
    $('tr').each(function(){

        if(!$(this).hasClass('processed'))
        {
            if($(this).is('#login_ad'))
            {
                $(this).find('> td:first-of-type').prepend('<i class="fa fa-sign-in"></i> ').css('color','green').parent().css('border-color','green');
                $(this).find('> td:last-of-type a').html('<i class="fas fa-arrow-right"></i>').css('background-color','green');
            }
            else if($(this).is('#logout_device'))
            {
                $(this).find('> td:first-of-type').append(' <i class="fa fa-sign-out"></i>').css('color','red').parent().css('border-color','red');
                $(this).find('> td:last-of-type a').html('<i class="fas fa-arrow-right"></i>').css('background-color','red');
            }
            else if($(this).is('#conn_reset_session'))
            {
                $(this).find('> td:first-of-type').append(' <i class="fa fa-sync"></i>').css('color','orange').parent().css('border-color','orange');
                $(this).find('> td:last-of-type a').html('<i class="fas fa-arrow-right"></i>').css('background-color','orange');
            }
            else
            {
                // only PZA
                $(this).find('> td:contains("CONN")').css('color','#36B1B9').parent().css('border-color','#36B1B9');

                // all
                $(this).find('> td:last-of-type a').html('<i class="fas fa-arrow-right"></i>').css('background-color','#36B1B9');
            }

            // equal heights
            $(this).css('min-height','250px');
            $(this).find('td:nth-child(1)').css('min-height','90px');
            $(this).find('td:nth-child(2)').css('min-height','60px');

            // link/button
            $(this).find('> td:last-of-type a').css('padding','5px 0px').css('display','inline-block').css('width','100%').css('color','white').css('border-radius','5px');

            // background
            if($(this).hasClass('even'))
            {
                $(this).css('background-color','#CCCCCC !important');
            }

            $(this).addClass('processed');
        }

    });
}


// ***********************************************
// APITOOL: login app
// ***********************************************
function editApitoolAppLogin()
{
    // add containers for desks and users
    $('div#customconector').parent().parent().append('<div class="item container custom-container-loginout"><div class="form"><div id="custom-form-loginout" class="form form-horizontal"><div class="form-group" id="custom-desks"><h4>Desks</h4></div><div class="form-group" id="custom-users"><h4>Users</h4></div></div></div></div>');

    // add desks
    $('#custom-desks').append('<div class="custom-overflow-hidden">'+getHtmlDwDesks()+'</div>');

    // add users
    $('#custom-users').append('<div class="custom-overflow-hidden">'+getHtmlDwUsers()+'</div>');

    // make forms half size
    $('div.form.form-horizontal > div.form-group').addClass('custom-form-half');

    // copy
    $('p.custom-loginout-copy').on('click', function(){

        if($(this).attr('data-type') == 'device')
        {
            $('input#device').val($(this).attr('data-value'));

            fillApitoolDwDeskName();
        }
        if($(this).attr('data-type') == 'usertokeninfo')
        {
            $('input#usertokeninfo').val($(this).attr('data-value'));

            fillApitoolDwUserName();
        }
    });

    // device name
    $('label[for="device"]').append('<span id="device-name"></span>');
    // user name
    $('label[for="usertokeninfo"]').append('<span id="user-name"></span>');
    // button
    $('div#customconector button[type="submit"]').append('&nbsp;&nbsp;&nbsp;<i class="fal fa-sign-in"></i> Login');


    // search for name on change of input
    $('input#device').on('input', fillApitoolDwDeskName);
    // search for name on change of input
    $('input#usertokeninfo').on('input', fillApitoolDwUserName);

}

// ***********************************************
// APITOOL: logout app
// ***********************************************
function editApitoolAppLogout()
{
    // add containers for desks
    $('div#customconector').parent().parent().append('<div class="item container custom-container-loginout"><div class="form"><div id="custom-form-loginout" class="form form-horizontal"><div class="form-group" id="custom-desks"><h4>Desks</h4></div></div></div></div>');

    // add desks
    $('#custom-desks').append('<div class="custom-overflow-hidden">'+getHtmlDwDesks()+'</div>');

    // make forms half size
    $('div.form.form-horizontal > div.form-group').addClass('custom-form-half');

    // copy
    $('p.custom-loginout-copy').on('click', function(){

        if($(this).attr('data-type') == 'device')
        {
            $('input#device').val($(this).attr('data-value'));

            fillApitoolDwDeskName();
        }
    });

    // device name
    $('label[for="device"]').append('<span id="device-name"></span>');
    // button
    $('div#customconector button[type="submit"]').append('&nbsp;&nbsp;&nbsp;Logout <i class="fal fa-sign-out"></i>');

    // search for name on change of input
    $('input#device').on('input', fillApitoolDwDeskName);
}


// ***********************************************
// APITOOL: reset app
// ***********************************************
function editApitoolAppReset()
{
    // add containers for desks
    $('div#customconector').parent().parent().append('<div class="item container custom-container-loginout"><div class="form"><div id="custom-form-loginout" class="form form-horizontal"><div class="form-group" id="custom-desks"><h4>Desks</h4></div></div></div></div>');

    // add desks
    $('#custom-desks').append('<div class="custom-overflow-hidden">'+getHtmlDwDesks()+'</div>');

    // make forms half size
    $('div.form.form-horizontal > div.form-group').addClass('custom-form-half');

    // copy
    $('p.custom-loginout-copy').on('click', function(){

        if($(this).attr('data-type') == 'device')
        {
            $('input#device').val($(this).attr('data-value'));

            fillApitoolDwDeskName();
        }
    });

    // device name
    $('label[for="device"]').append('<span id="device-name"></span>');
    // button
    $('div#customconector button[type="submit"]').append('&nbsp;&nbsp;&nbsp;Reset <i class="fas fa-sync"></i>');

    // search for name on change of input
    $('input#device').on('input', fillApitoolDwDeskName);
}

// ***********************************************
// APITOOL: fill in desk name
// ***********************************************
function fillApitoolDwDeskName()
{
    var desk_ip;
    var desk_name;

    var desk_icon;
    var desk_icon_type;
    var desk_icon_name;

    desk_ip = $('input#device').val();

    if(dw_desks[desk_ip] !== undefined && dw_desks[desk_ip][0] !== undefined)
    {
        desk_name = dw_desks[desk_ip][0];

        desk_icon = getDwDeskIcon(desk_ip);
        desk_icon_type = desk_icon[0];
        desk_icon_name = desk_icon[1];

        $('#device-name').html(': <i class="fal fa-'+desk_icon_type+'"></i> '+desk_name);
    }
    else
    {
        $('#device-name').html('');
    }
}

// ***********************************************
// APITOOL: fill in user name
// ***********************************************
function fillApitoolDwUserName()
{
    var user_number;
    var user_name;

    var user_icon;
    var user_icon_type;
    var user_icon_name;

    user_number = $('input#usertokeninfo').val();

    if(dw_users[user_number] !== undefined && dw_users[user_number][0] !== undefined)
    {
        user_name = dw_users[user_number][0];

        user_icon = getDwUserIcon(user_number);
        user_icon_type = user_icon[0];
        user_icon_name = user_icon[1];

        $('#user-name').html(': <i class="fal fa-'+user_icon_type+'"></i> '+user_name);
    }
    else
    {
        $('#user-name').html('');
    }
}

// ***********************************************
// Change save icon
// ***********************************************
function editSaveIcon()
{
    $('div.btn-toolbar button#save > svg').removeClass('fa-check').addClass('fa-save');
}


// ***********************************************
// Change table content alignment
// ***********************************************
function editTableContentCenterToLeft()
{
    // table(s): align left
    $('table.text-center').removeClass('text-center').addClass('text-left');
    $('table.dataTable').addClass('text-left');
}

// ***********************************************
// Change every row to click to edit
// ***********************************************
function editTableClickToEdit()
{
    $('table.datatable tbody td.readonly svg').parents('table.datatable').find('tbody tr td:not(.readonly)').on('click', function(){
        $(this).parent().addClass('row-selected');
    });

/*
    $('div#json_values_wrapper table tbody tr td:not(.readonly)').on('click', function(){
        $(this).parent().addClass('row-selected');
    });
    */
}


// ***********************************************
// Get HTML list of desks
// ***********************************************
function getHtmlDwDesks()
{
    var html_desks = '';
    var desk_icon = '';
    var desk_icon_type = '';
    var desk_icon_name = '';

    // find redis groups
    var groups = [];
    var group;

    $.each(dw_desks, function(ip, desk) {
        if(desk[1] !== undefined)
        {
            group = desk[1];

            if(!groups.includes(group))
            {
                groups.push(group);
            }
        }

    });

    // loop groups
    $.each(groups, function(index, group) {
        html_desks += '<h6>'+group+'</h6>';

        $.each(dw_desks, function(ip, desk) {
            if(desk[1] !== undefined && desk[1] == group)
            {
                // get desk icon informatien
                desk_icon = getDwDeskIcon(ip);

                desk_icon_type = desk_icon[0];
                desk_icon_name = desk_icon[1];

                html_desks += '<p class="custom-loginout-copy" data-value="'+ip+'" data-type="device"><i class="fal fa-arrow-circle-up"></i> <span class="custom-loginout-value">'+ip+'</span> <span class="custom-icon-width"><i class="fal fa-'+desk_icon_type+'" title="'+desk_icon_name+'"></i></span> <span class="custom-loginout-name">'+desk[0]+'</span></p>';
            }
        });
    });

    return html_desks;
}

// ***********************************************
// Get HTML list of users
// ***********************************************
function getHtmlDwUsers()
{
    var html_users = '';
    var user_icon = '';
    var user_icon_type = '';
    var user_icon_name = '';

    // find user teams
    var teams = [
        'ICT',
        'FO',
        'IOF',
        'DSP',
        'VRK',
        'CAM',
        'BL',
        'SEC',
        'MV',
        'AMIGO'
    ];

    // loop teams
    $.each(teams, function(index, team) {
        html_users += '<h6>'+team+'</h6>';

        $.each(dw_users, function(number, user) {
            if(user[1] !== undefined && user[1] == team)
            {
                // get user icon informatien
                user_icon = getDwUserIcon(number);

                user_icon_type = user_icon[0];
                user_icon_name = user_icon[1];

                html_users += '<p class="custom-loginout-copy" data-value="'+number+'" data-type="usertokeninfo"><i class="fal fa-arrow-circle-up"></i> <span class="custom-loginout-value">'+number+'</span> <span class="custom-icon-width"><i class="fal fa-'+user_icon_type+'" title="'+user_icon_name+'"></i></span> <span class="custom-loginout-name">'+user[0]+'</span></p>';
            }
        });
    });

    return html_users;
}

// ***********************************************
// Get icon of desk
// ***********************************************
function getDwDeskIcon(ip)
{
    var desk;

    var desk_icon = [];
    var desk_icon_type = 'circle';
    var desk_icon_name = 'Onbekend';

    if(dw_desks[ip] !== undefined && dw_desks[ip][0] !== undefined)
    {
        desk = dw_desks[ip];

        if(desk[0][desk[0].length -1] == 'W')
        {
            desk_icon_type = 'columns';
            desk_icon_name = 'DataWall';
        }
        else if(desk[0].includes('MASTER'))
        {
            desk_icon_type = 'life-ring';
            desk_icon_name = 'Master';
        }
        else if(desk[0].includes('DSP'))
        {
            desk_icon_type = 'walkie-talkie';
            desk_icon_name = 'Dispatch';

            if(desk[2] !== undefined && desk[2].includes('COF'))
            {
                desk_icon_type = 'star';
                desk_icon_name = 'COF';
            }

            if(desk[2] !== undefined && desk[2].includes('VRK'))
            {
                desk_icon_type = 'traffic-light';
                desk_icon_name = 'Verkeersregelkamer';
            }
        }
        else if(desk[0].includes('CAM'))
        {
            desk_icon_type = 'cctv';
            desk_icon_name = 'Cameraroom';

            if(desk[2] !== undefined && desk[2].includes('RTIC'))
            {
                desk_icon_type = 'volume';
                desk_icon_name = 'Cameraroom';
            }
        }
        else if(desk[0].includes('BL'))
        {
            desk_icon_type = 'phone';
            desk_icon_name = 'Blauwe Lijn';
        }
        else if(desk[0].includes('CEL'))
        {
            desk_icon_type = 'door-closed';
            desk_icon_name = 'Commandocel';
        }
        else if(desk[0].includes('CP'))
        {
            desk_icon_type = 'users-class';
            desk_icon_name = 'CP';
        }
        else if(desk[0].includes('CHEF'))
        {
            desk_icon_type = 'crown';
            desk_icon_name = 'Korpschef';
        }
        else if(desk[1].includes('INTEL'))
        {
            desk_icon_type = 'id-badge';
            desk_icon_name = 'INTEL';
        }
        else if(desk[1].includes('AMIGO'))
        {
            desk_icon_type = 'key';
            desk_icon_name = 'AMIGO';
        }
        else if(desk[1].includes('SPARE'))
        {
            desk_icon_type = 'flask';
            desk_icon_name = 'SPARE';
        }
    }

    desk_icon.push(desk_icon_type);
    desk_icon.push(desk_icon_name);

    return desk_icon;
}

// ***********************************************
// Get icon of user
// ***********************************************
function getDwUserIcon(number)
{
    var user;

    var user_icon = [];
    var user_icon_type = 'user-circle';
    var user_icon_name = 'Onbekend';

    if(dw_users[number] !== undefined && dw_users[number][1] !== undefined)
    {
        user = dw_users[number];

        if(user[1].includes('ICT'))
        {
            user_icon_type = 'wrench';
            user_icon_name = 'ICT';
        }
        else if(user[1].includes('FO'))
        {
            user_icon_type = 'wrench';
            user_icon_name = 'FO';
        }
        else if(user[1].includes('IOF'))
        {
            user_icon_type = 'star';
            user_icon_name = 'IOF';
        }
        else if(user[1].includes('DSP'))
        {
            user_icon_type = 'walkie-talkie';
            user_icon_name = 'Dispatch';
        }
        else if(user[1].includes('VRK'))
        {
            user_icon_type = 'traffic-light';
            user_icon_name = 'Verkeersregelkamer';
        }
        else if(user[1].includes('CAM'))
        {
            user_icon_type = 'cctv';
            user_icon_name = 'RTIC';
        }
        else if(user[1].includes('SEC'))
        {
            user_icon_type = 'shield-alt';
            user_icon_name = 'Securitas';
        }
        else if(user[1].includes('MV'))
        {
            user_icon_type = 'city';
            user_icon_name = 'MV';
        }
        else if(user[1].includes('BL'))
        {
            user_icon_type = 'phone';
            user_icon_name = 'Blauwe Lijn';
        }

        else if(user[1].includes('INTEL'))
        {
            user_icon_type = 'id-badge';
            user_icon_name = 'INTEL';
        }

        else if(user[1].includes('AMIGO'))
        {
            user_icon_type = 'key';
            user_icon_name = 'AMIGO';
        }
/*
        else if(user[1].includes('INT'))
        {
            user_icon_name = 'Interventie';
        }
        else if(user[1].includes('OO'))
        {
            user_icon_name = 'Openbare Orde';
        }
*/
        else if(user[1].includes('RO'))
        {
            user_icon_name = 'RO';
        }

        else if(user[1].includes('WALL'))
        {
            user_icon_type = 'columns';
            user_icon_name = 'DataWall';
        }
    }

    user_icon.push(user_icon_type);
    user_icon.push(user_icon_name);

    return user_icon;
}

// ***********************************************
// Compare software versions
// ***********************************************
function versionCompare(a,b) {
  var av = a.match(/([0-9]+|[^0-9]+)/g)
  var bv = b.match(/([0-9]+|[^0-9]+)/g)
  for (;;) {
    var ia = av.shift();
    var ib = bv.shift();
    if ( (typeof ia === 'undefined') && (typeof ib === 'undefined') ) { return 0; }
    if (typeof ia === 'undefined') { ia = '' }
    if (typeof ib === 'undefined') { ib = '' }

    var ian = parseInt(ia);
    var ibn = parseInt(ib);
    if ( isNaN(ian) || isNaN(ibn) ) {
      // non-numeric comparison
      if (ia < ib) { return -1;}
      if (ia > ib) { return 1;}
    } else {
      if (ian < ibn) { return -1;}
      if (ian > ibn) { return 1;}
    }
  }
}

// ***********************************************
// Move column in table
// ***********************************************
function moveColumn(table, from, to) {
    var rows = $('tr', table);
    var cols;
    rows.each(function() {
        cols = $(this).children('th, td');
        cols.eq(from).detach().insertBefore(cols.eq(to));
    });
}


// ***********************************************
// DeskWall Desks
// ***********************************************
function load_dw_desks()
{
    var desks_json_url = 'https://192.168.192.1/scripts/deskwall-tools/json/dw-desks.json';

    return $.getJSON(desks_json_url)
    .done(function(data){
        dw_desks = data;
    })
    .fail(function(jqxhr, textStatus, error){

    });

}

// ***********************************************
// DeskWall Users
// ***********************************************
function load_dw_users()
{
    var users_json_url = 'https://192.168.192.1/scripts/deskwall-tools/json/dw-users.json';

    return $.getJSON(users_json_url)
    .done(function(data){
        dw_users = data;
    })
    .fail(function(jqxhr, textStatus, error){

        GM_addStyle('body span.dw-tools { padding: 3px 15px 3px 15px; background-color: rgba(50, 50, 50, 0.75); border-radius: 0px 0px 5px 5px; font-size: 13px; color: #36B1B9; }');
        GM_addStyle('body span.dw-tools a { color: #EEEEEE; font-weight: bold; }');
        GM_addStyle('body span.dw-tools a:hover { color: #CCCCCC; }');

        GM_addStyle('body span.dw-server-plus {  text-align: left; position: absolute; right: 40px; top: 0px; }');
        GM_addStyle('body span.dw-server-plus ul { margin: 3px 0px 3px 20px; }');


        var el_serverplus = '';
        el_serverplus += '<span class="dw-tools dw-server-plus"><i class="fas fa-exclamation-triangle"></i> <b>DeskWall Tools Server Informatie</b> is nog niet beschikbaar';
        el_serverplus += '<ul><li>Open de <a href="https://192.168.192.1/scripts/deskwall-tools/server.html" target="_blank">DeskWall Tools Server</a> in een nieuwe tab</li>';
        el_serverplus += '<li>Klik op <b>Geavanceerd</b></li>';
        el_serverplus += '<li>Klik op <b>Doorgaan naar 192.168.192.1 (onveilig)</b></li></ul>';
        el_serverplus += 'Herlaad daarna deze pagina';
        el_serverplus += '</span>';

        $('body').append(el_serverplus);
    });
}