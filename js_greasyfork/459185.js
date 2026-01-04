// ==UserScript==
// @name         GLPI Plus
// @namespace    http://tampermonkey.net/
// @version      1.10.1
// @description  GLPI optimizations for layout and dark modes
// @author       StvnMrtns
// @match        https://glpi.politie.antwerpen.be/*
// @match        http://glpi-d-web-2.politie.local/*
// @icon         https://www.google.com/s2/favicons?sz=96&domain=services.glpi-network.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/459185/GLPI%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/459185/GLPI%20Plus.meta.js
// ==/UserScript==

var groups_short = {
    'OT':        'Operational Technology',

    'SD':        'Servicedesk',
    'HD':            'Helpdesk',
    'INT':           'Interventies',
    'LM':            'Lifecycle management',
    'PM':            'Project management',
    'RM':            'Remote management',
    'SEC':           'Secretariaat',
    'TI':            'Technische Interventie',
    'TI@H':          'TI administratie voor thuiswerk',

    'SYS':       'Systeembeheer',
    'ARCH':          'Systeem - Architecten',
    'D&I':           'Systeem - Development &amp; Interfacing',
    'DevOpS':        'Systeem - DevOps',
    'EUE':           'Systeem - End User Environment',
    'EA':            'Systeem - Enterprise Applications',
    'IF':            'Systeem - Interfacing',
    'N&S':           'Systeem - Network &amp; Security',
    'PD&I':          'Systeem - Physical Datacenter & Infrastructure',
    'SDDC':          'Systeem - Software-Defined Data Center',
    'S&B':           'Systeem - Storage & Backup',
    'UAM':           'Systeem - User Access Management',

    'PW ICT':        'Projectwerking ICT',
    'PW':            'Projectwerking',
    'FOCUS Appl':    'Focus Applicatiebeheer',

    'FO':            'Functionele ondersteuning',
};

(function() {
    'use strict';

    var version_name = '';
    var version_number = GM_info.script.version;

    // global structure
    editGlobalStructure(version_name, version_number);

    $(window).on('load', function() {

        // configuration
        var gm_config_frame = document.createElement('div');
        document.body.appendChild(gm_config_frame);

        var label_itil_colors = '';
        label_itil_colors += '<br><span style="display: inline-block; min-width: 80px; color: black;"><i class="far fa-circle me-1"></i> Opgelost</span> <i class="fas fa-arrow-right me-2"></i> <span style="color: #498abf"><i class="far fa-circle me-1"></i> Opgelost</span>';
        label_itil_colors += '<br><span style="display: inline-block; min-width: 80px; color: black"><i class="fas fa-circle me-1"></i> Gesloten</span> <i class="fas fa-arrow-right me-2"></i> <span style="color: #498abf"><i class="fas fa-circle me-1"></i> Gesloten</span>';
        label_itil_colors += '<br><span style="display: inline-block; min-width: 80px; color: #1b2f62"><i class="far fa-calendar me-1"></i> Gepland</span> <i class="fas fa-arrow-right me-2"></i> <span style="color: #49bf4d"><i class="far fa-calendar me-1"></i> Gepland</span>';

        GM_config.init(
        {
            'id': 'GLPIPlusConfig',
            'title': 'GLPI Plus | Instellingen',
            'fields':
            {
                'custom_elements_title':
                {
                    'section': ['Individueel ticket', ''],
                    'type': 'checkbox',
                    'default': true,
                    'label': 'Ticket: verplaats status & onderwerp'
                },
                'custom_elements_users':
                {
                    'type': 'checkbox',
                    'default': true,
                    'label': 'Ticket: dupliceer gebruikersinformatie (compact)'
                },
                'custom_elements_opening':
                {
                    'type': 'checkbox',
                    'default': true,
                    'label': 'Ticket: dupliceer openingspost'
                },
                'custom_elements_linked':
                {
                    'type': 'checkbox',
                    'default': true,
                    'label': 'Ticket: dupliceer linked tickets & items (compact)'
                },

                'custom_overview_entity':
                {
                    'section': ['Overzicht tickets', ''],
                    'type': 'checkbox',
                    'default': true,
                    'label': 'Overzicht: verberg kolom entititeit'
                },
                'custom_overview_info':
                {
                    'type': 'checkbox',
                    'default': true,
                    'label': 'Overzicht: verberg informatie-popup'
                },
                'custom_overview_linked':
                {
                    'type': 'checkbox',
                    'default': true,
                    'label': 'Overzicht: beperk aantal gelinke items'
                },
                'custom_overview_font_size':
                {
                    'type': 'checkbox',
                    'default': false,
                    'label': 'Overzicht: kleinere lettergroottes'
                },
                'custom_overview_highlight_dates':
                {
                    'type': 'checkbox',
                    'default': true,
                    'label': 'Overzicht: accentueer tickets van <span class="itilstatus assigned">vandaag</span> en <span class="itilstatus waiting">gisteren</span>'
                },
                'custom_overview_dashboard':
                {
                    'type': 'checkbox',
                    'default': true,
                    'label': 'Overzicht: verberg dashboard'
                },

                'custom_itil_colors':
                {
                    'section': ['Algemeen', ''],
                    'type': 'checkbox',
                    'default': true,
                    'label': 'Algemeen: wijzig statuskleuren'+label_itil_colors
                },
                /*
                'custom_login_dark_mode':
                {
                    'type': 'checkbox',
                    'default': false,
                    'label': 'Algemeen: dark mode op aanmeldscherm'
                }
                */
            },
            'events':
            {
                'save': function(){
                    window.location.reload(true);
                },
                'reset': function(){
                    window.location.reload(true);
                },
                'init': initPages
            },
            'frame': gm_config_frame
        });


        var page_url = window.location.href;
        var page_ticket = page_url.indexOf('ticket.form.php') >= 0 && page_url.indexOf('id=') >= 0;

        // single ticket tinymce-editor
        /*
        if(page_ticket) {
            // wait till dynamic content is loaded
            waitForKeyElements ('body#tinymce', editTicketSingle);
        }
        */
        if(page_ticket) {
            // wait till dynamic content is loaded
            waitForKeyElements ('iframe.tox-edit-area__iframe', editTinyMce);
        }
    });

    /*
    $(window).on('resize', function() {

        // single ticket
        if(page_ticket) {
            // wait till dynamic content is loaded

            editTicketSingle()
            //waitForKeyElements ('div#itil-object-container', editTicketSingle);
        }
    });
    */
})();

// ***********************************************
// Init pages
// ***********************************************
function initPages()
{
    var page_url = window.location.href;
    var page_login = $('body.welcome-anonymous').length > 0;
    var page_redirect_after_login = GM_getValue('custom_url_after_login','') != '';

    var page_home = page_url.indexOf('central.php') >= 0;
    var page_search = page_url.indexOf('search.php') >= 0;
    var page_tickets = page_url.indexOf('ticket.php') >= 0;
    var page_ticket = page_url.indexOf('ticket.form.php') >= 0 && page_url.indexOf('id=') >= 0;
    var page_ticket_new = page_url.indexOf('ticket.form.php') >= 0 && page_url.indexOf('id=') < 0;
    var page_projects = page_url.indexOf('project.php') >= 0;
    var page_project = page_url.indexOf('project.form.php') >= 0 && page_url.indexOf('id=') >= 0;
    var page_assets = page_url.indexOf('computer.php') >= 0
    || page_url.indexOf('monitor.php') >= 0
    || page_url.indexOf('software.php') >= 0
    || page_url.indexOf('networkequipment.php') >= 0
    || page_url.indexOf('peripheral.php') >= 0
    || page_url.indexOf('printer.php') >= 0
    || page_url.indexOf('cartridgeitem.php') >= 0
    || page_url.indexOf('consumableitem.php') >= 0
    || page_url.indexOf('phone.php') >= 0
    || page_url.indexOf('cable.php') >= 0
    || page_url.indexOf('item_device.php') >= 0
    || page_url.indexOf('simcard.php') >= 0
    || page_url.indexOf('radio.php') >= 0
    || page_url.indexOf('auto.php') >= 0
    || page_url.indexOf('allassets.php') >= 0
    var page_asset = page_url.indexOf('ticket.form.php') == -1 && page_url.indexOf('form.php') >= 0 && page_url.indexOf('id=') >= 0;

    var page_search_results = ('div.search-results').lenght;

    $('.gm_config_open').on("click", function() {
        $('div.nav-item a.nav-link').attr('aria-expanded', 'false');
        $('div.nav-item a.nav-link').removeClass('show');
        $('div.nav-item div.dropdown-menu').removeClass('show');

        GM_config.open();

        GM_addStyle('#GLPIPlusConfig { width: 50% !important; height: 50% !important; background-color: #333333 !important; border: 2px solid #CCCCCC !important; border-radius: 5px !important; overflow: hidden; }');
        GM_addStyle('#GLPIPlusConfig #GLPIPlusConfig_header { padding: 10px !important; }');
        GM_addStyle('#GLPIPlusConfig #GLPIPlusConfig_wrapper .section_header_holder { margin-top: 0px !important; }');
        GM_addStyle('#GLPIPlusConfig #GLPIPlusConfig_wrapper .section_header_holder .section_header { padding: 5px !important; margin: 0px 0px 5px 0px; background-color: #444444 !important; border: none !important; color: #CCCCCC !important; }');
        GM_addStyle('#GLPIPlusConfig #GLPIPlusConfig_wrapper .section_header_holder .section_desc { padding: 5px !important; border: none !important; color: #CCCCCC !important; background: transparent !important; }');
        GM_addStyle('#GLPIPlusConfig #GLPIPlusConfig_wrapper input { margin: 2px 10px !important; }');
        GM_addStyle('#GLPIPlusConfig #GLPIPlusConfig_wrapper label { margin: 2px 2px !important; color: #CCCCCC !important; }');
        GM_addStyle('#GLPIPlusConfig #GLPIPlusConfig_buttons_holder { margin-top: 25px !important; background-color: #444444 !important; }');
        GM_addStyle('#GLPIPlusConfig #GLPIPlusConfig_buttons_holder button { padding: 7px 16px !important; line-height: normal !important; }');
        GM_addStyle('#GLPIPlusConfig #GLPIPlusConfig_resetLink { color: #CCCCCC !important; }');

        GM_addStyle('#GLPIPlusConfig .fas { font-family: "Font Awesome 6 Free" !important; }');
        GM_addStyle('#GLPIPlusConfig .far { font-family: "Font Awesome 6 Free" !important; }');

        $('#GLPIPlusConfig #GLPIPlusConfig_header').addClass('navbar-dark topbar');
        $('#GLPIPlusConfig #GLPIPlusConfig_wrapper input').addClass('form-check-input');
        $('#GLPIPlusConfig #GLPIPlusConfig_buttons_holder').addClass('center');
        $('#GLPIPlusConfig #GLPIPlusConfig_buttons_holder button').addClass('btn btn-primary');
        $('#GLPIPlusConfig #GLPIPlusConfig_buttons_holder .reset_holder').addClass('center');
    });


    // global CSS
    editGlobalCSS();

    // login
    if(page_login)
    {
        editLogin();
    }
    // redirect after login
    if(page_redirect_after_login)
    {
        editLoginRedirect();
    }

    // home
    if(page_home) {
        // wait till dynamic content is loaded
        waitForKeyElements ('table.card-table', editHome);
        waitForKeyElements ('table.tab_cadre_fixe', editHome);
    }

    // search
    if(page_search) {
        // wait till dynamic content is loaded
        waitForKeyElements ('table.search-results', editSearch);
    }

    // overview tickets
    if(page_tickets) {
        // wait till dynamic content is loaded
        waitForKeyElements ('table.search-results', editTicketOverview);
    }

    // single ticket
    if(page_ticket) {
        // wait till dynamic content is loaded
        waitForKeyElements ('div#itil-object-container', editTicketSingle);

        // on change: items
        var observer_items = new MutationObserver(function(e) {
            editTicketSingleItemOverview();
        });
        observer_items.observe($('div.tab-pane[id^="tab-Item"]')[0], {childList: true, subtree: false});

        // on change: history
        var observer_history = new MutationObserver(function(e) {
            editTicketSingleHistory();
        });
        observer_history.observe($('div.tab-pane[id^="tab-Log"]')[0], {childList: true, subtree: false});
    }

    // new ticket
    if(page_ticket_new) {
        // wait till dynamic content is loaded
        waitForKeyElements ('div#itil-object-container', editTicketNew);
    }

    // overview projects
    if(page_projects) {
        // wait till dynamic content is loaded
        waitForKeyElements ('table.search-results', editProjectOverview);
    }

    // single project
    if(page_project) {
        // wait till dynamic content is loaded
        waitForKeyElements ('table.tab_cadre_fixehov', editProjectTicketOverview);
    }


    // overview assets
    if(page_assets) {
        // wait till dynamic content is loaded
        waitForKeyElements ('table.search-results', editAssetOverview);
    }
    // single asset
    if(page_asset && !page_project) {
        // wait till dynamic content is loaded
        waitForKeyElements ('table.tab_cadre_fixehov', editAssetTicketOverview);
    }


    // vis vangen
    var vis_date_show = '1/4/2026';
    var vis_message = '';

    // debug
    //GM_setValue('vis_show_message', '');
    //vis_date_show = new Date().toLocaleDateString();

    if(new Date().toLocaleDateString() == vis_date_show)
    {
        if(GM_getValue('vis_show_message', '') == '')
        {
            GM_setValue('vis_show_message', 'full');
        }

        vis_message += '<div id="el_vis_full_toast_container" class="toast-container bottom-0 start-0 p-3 '+(GM_getValue('vis_show_message') == 'full' ? 'show' : 'hide')+'">';
        vis_message += '  <div id="el_vis_full_toast" class="toast animate__animated animate__tada animate__delay-2s animate__slow fade '+(GM_getValue('vis_show_message') == 'full' ? 'show' : 'hide')+'" role="alert" aria-live="assertive" aria-atomic="true">';

        vis_message += '    <div class="toast-header text-dark">';
        vis_message += '      <strong class="me-auto">GLPI Plus: boodschap van de developer</strong>';
        vis_message += '      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>';
        vis_message += '    </div>';

        vis_message += '    <div class="toast-body">';
        vis_message += '      <p><strong>GLPI Plus</strong>: ten gevolge van de stijgende werkingskosten zal de gratis versie in de toekomst helaas niet meer ondersteund en bijgevolg gedeactiveerd worden.</p>';
        vis_message += '      <p><strong>GLPI Premium</strong>: als alternatief is een betalende versie volop in ontwikkeling en zal deze op korte termijn beschikbaar komen met een abonnementsformule van slechts € 1,04 per maand.</p>';
        vis_message += '      <div class="d-flex justify-content-between">';
        vis_message += '        <span>Meer informatie volgt</span>';
        vis_message += '        <span><button class="btn btn-primary" id="el_vis_hide">Begrepen</button></span>';
        vis_message += '      </div>';
        vis_message += '    </div>';

        vis_message += '  </div>';
        vis_message += '</div>';


        vis_message += '<div id="el_vis_small_toast_container" class="toast-container bottom-0 start-0 p-3 '+(GM_getValue('vis_show_message') == 'small' ? 'show' : 'hide')+'">';
        vis_message += '  <div id="el_vis_small_toast" class="toast animate__animated animate__delay-2s animate__slow fade '+(GM_getValue('vis_show_message') == 'small' ? 'show' : 'hide')+'" role="alert" aria-live="assertive" aria-atomic="true">';

        vis_message += '    <div class="toast-header">';
        vis_message += '      <strong id="el_vis_show" class="me-auto" style="cursor: pointer;">GLPI Plus: boodschap van de developer</strong>';
        vis_message += '      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>';
        vis_message += '    </div>';

        vis_message += '  </div>';
        vis_message += '</div>';

        if(GM_getValue('vis_show_message') == 'full')
        {
            GM_setValue('vis_show_message', 'small');
        }

        $(document).on('click','#el_vis_hide', function(){
            GM_setValue('vis_show_message', 'none');

            $('#el_vis_full_toast').find('button.btn-close').click();
        });

        $(document).on('click','#el_vis_show', function(){
            $('#el_vis_small_toast_container').removeClass('show').addClass('hide');
            $('#el_vis_small_toast').removeClass('show').addClass('hide');
            $('#el_vis_full_toast_container').removeClass('hide').addClass('show');
            $('#el_vis_full_toast').removeClass('hide').addClass('show');
        });

        $('body').append(vis_message);

    }
    else
    {
        GM_setValue('vis_show_message', '');
    }
}

// ***********************************************
// Edit global structure
// ***********************************************
function editGlobalStructure(name, number)
{
    // GLPI Plus logo
    var el_logoplus = '<span class="glpi-plus"><span class="version">'+number+'</span> '+name+'+</span>';
    $('a.navbar-brand').append(el_logoplus);

    // GLPI Plus configuration
    var el_configplus = '<a href="#" class="dropdown-item gm_config_open"><i class="ti fa-fw ti-adjustments-alt"></i> Mijn instellingen [GLPI Plus]</a>';
    $('div.nav-item div.dropdown-menu a[href="/front/preference.php"]').after(el_configplus);

    // GLPI Plus login
    $('body.welcome-anonymous div.page-anonymous div.text-muted').html($('body.welcome-anonymous div.page-anonymous div.text-muted').html()+'<br><span class="text-primary">GLPI Plus '+number+' '+name+'</span>');
}

// ***********************************************
// Edit global CSS
// ***********************************************
function editGlobalCSS()
{

    // current style
    var style_auror_dark = false;
    var style_darker = false;
    var style_midnight = false;
    var style_path = '';

    $('link[rel="stylesheet"]').each(function(){
        if($(this).attr('href').indexOf('css_palettes_auror_dark') !== -1)
        {
           style_auror_dark = true;
        }
        if($(this).attr('href').indexOf('css_palettes_darker') !== -1)
        {
           style_darker = true;
        }
        if($(this).attr('href').indexOf('css_palettes_midnight') !== -1)
        {
           style_midnight = true;
        }

        // save css style (if not default palette)
        if($('body.welcome-anonymous').length == 0 && $(this).attr('href').indexOf('css_palettes_') !== -1 && $(this).attr('href').indexOf('css_palettes_auror.min.css') === -1)
        {
            GM_setValue('custom_css_style_path', $(this).attr('href').substring(0,$(this).attr('href').indexOf('?v=')));
        }
    });

    // current layout
    var page_menu_header = !($('body').hasClass('vertical-layout'));
    var page_menu_side = $('body').hasClass('vertical-layout');


    // PAGE

    // header
    if(true)
    {
        if(page_menu_header)
        {
            GM_addStyle('header.navbar.topbar { padding: 0px; }');
            GM_addStyle('header.navbar.topbar a.navbar-brand { padding: 0px; position: relative; }');
            GM_addStyle('header.navbar.topbar a.navbar-brand span.glpi-plus { padding: 5px; font-size: 10px; font-weight: 600; text-transform: uppercase; position: absolute; right: 0px; bottom: -8px; }');
            GM_addStyle('header.navbar.topbar a.navbar-brand span.glpi-plus span.version { font-weight: 300; }');

            GM_addStyle('div.navbar.secondary-bar { padding: 0px; top: 0px; }');
        }
        if(page_menu_side)
        {
            GM_addStyle('aside.navbar.sidebar a.navbar-brand { position: relative; }');
            GM_addStyle('aside.navbar.sidebar a.navbar-brand span.glpi-plus { padding: 5px; font-size: 10px; font-weight: 600; text-transform: uppercase; position: absolute; right: 3px; bottom: 0px; }');
            GM_addStyle('aside.navbar.sidebar a.navbar-brand span.glpi-plus span.version { font-weight: 300; }');
        }
    }

    // body
    if(true)
    {
        if(page_menu_header)
        {
            GM_addStyle('div.page-body { margin-top: 5px; padding: 0px 10px; }');
        }
        if(page_menu_side)
        {
            GM_addStyle('div.page-body { margin-top: 5px; padding: 0px 10px; }');
        }

        GM_addStyle('span.glpi-badge-nnn { opacity: 0.5 !important; }');
        GM_addStyle('span.glpi-badge-nnn:hover { opacity: 1 !important; }');
    }

    // tables
    if(true)
    {
        if(GM_config.get('custom_overview_font_size') == true)
        {
            GM_addStyle('table.card-table td { font-size: 85%; }');
            GM_addStyle('table.search-results td { font-size: 85%; }');
            GM_addStyle('table.tab_cadre_fixehov td { font-size: 85%; }');
        }

        GM_addStyle('table.card-table span.glpi-badge { margin: -1px 1px 4px 0px !important; padding: 1px 3px !important; white-space: nowrap !important; flex-wrap: nowrap !important; }');
        GM_addStyle('table.search-results span.glpi-badge { margin: -1px 1px 4px 0px !important; padding: 1px 3px !important; white-space: nowrap !important; flex-wrap: nowrap !important; }');
        GM_addStyle('table.tab_cadre_fixehov span.glpi-badge { margin: -1px 1px 4px 0px !important; padding: 1px 3px !important; white-space: nowrap !important; flex-wrap: nowrap !important; }');

        GM_addStyle('div.tab-pane table.search-results td { padding: 0.35rem 0.5rem !important; }');
        GM_addStyle('div.tab-pane table.search-results span.glpi-badge { margin: 0px 1px 0px 0px !important; }');
    }
    if(style_auror_dark)
    {
        GM_addStyle('table.card-table a { color: #fec95c; }');
        GM_addStyle('table.card-table a:hover { color: #e5b553; }');
        GM_addStyle('table.search-results a { color: #fec95c; }');
        GM_addStyle('table.search-results a:hover { color: #e5b553; }');
        GM_addStyle('table.tab_cadre_fixehov a { color: #fec95c; }');
        GM_addStyle('table.tab_cadre_fixehov a:hover { color: #e5b553; }');

        GM_addStyle('div.qtip a { color: #fec95c; }');
        GM_addStyle('div.qtip a:hover { color: #e5b553; }');
    }

    // forms
    if(true)
    {
        // search form
        GM_addStyle('div.search-form div.list-group div.list-group-item { padding-top: 0px !important; }');

        if(GM_config.get('custom_overview_font_size') == true)
        {
            GM_addStyle('div.search-form div.list-group span { font-size: 90%; }');
            GM_addStyle('div.search-form div.list-group input { font-size: 90%; }');
        }
    }
    if(style_auror_dark)
    {
        // forms
        GM_addStyle('.tox.tox-tinymce { border: 1px solid #35455a !important; }');

        GM_addStyle('table.tab_cadre_fixe input.form-select { color: #9ca8c0 !important; border: 1px solid #35455a !important; }');
        GM_addStyle('table.tab_cadre_fixe input.form-select:focus { color: #9ca8c0 !important; border: 1px solid #b4bfce !important; outline: 0 !important; box-shadow: 0 0 0 0.25rem rgba(254, 201, 92, 0.25) !important; }');
        GM_addStyle('table.tab_cadre_fixe textarea { color: #9ca8c0 !important; border: 1px solid #35455a !important; }');
        GM_addStyle('table.tab_cadre_fixe textarea:focus { color: #9ca8c0 !important; border: 1px solid #b4bfce !important; outline: 0 !important; box-shadow: 0 0 0 0.25rem rgba(254, 201, 92, 0.25) !important; }');
        GM_addStyle('.select2-container.select2-container--disabled .select2-selection { border-color: #35455a !important; }');
        GM_addStyle('.select2-container.select2-container--disabled .select2-selection .select2-selection__rendered { color: #757d91 !important; }');

        GM_addStyle('.tag_select + .select2-container.select2-container--default { color: #9ca8c0 !important; border: 1px solid #35455a !important; border-radius: 4px !important; }');
        GM_addStyle('.tag_select + .select2-container.select2-container--default .select2-selection--multiple { border: none !important; border-radius: 4px !important; }');
        GM_addStyle('.tag_select + .select2-container.select2-container--open { color: #9ca8c0 !important; border: 1px solid #b4bfce !important; border-radius: 4px 4px 0px 0px !important; }');
        GM_addStyle('.tag_select + .select2-container.select2-container--open .select2-selection--multiple { background-color: #35455a !important; }');
        GM_addStyle('.tag_select + .select2-container.select2-container--default .select2-dropdown.select2-dropdown--below { border-color: #b4bfce !important; }');
    }

    // popup
    if(style_auror_dark)
    {
        GM_addStyle('div.toast div.toast-header { background-color: #fec95c !important; }');
        GM_addStyle('div.toast div.toast-header { color: #232e3c !important; }');
        GM_addStyle('div.toast div.toast-header button.btn-close { background-color: #232e3c !important; filter: invert(0) brightness(1) grayscale(0) !important; }');
    }

    // page height
    if(true)
    {
        if(page_menu_header)
        {
            GM_addStyle('div.col.search-container { height: calc(100vh - 79px - 20px - 20px) !important; }');
        }
        if(page_menu_side)
        {
            GM_addStyle('div.col.search-container { height: calc(100vh - 45px - 20px) !important; }');
        }
    }

    // itil
    if(true)
    {
        if(GM_config.get('custom_itil_colors') == true)
        {
            GM_addStyle('.itilstatus.planned { color: #49bf4d !important; }');
            GM_addStyle('.itilstatus.solved { color: #498abf !important; }');
            GM_addStyle('.itilstatus.closed { color: #498abf !important; }');
            GM_addStyle('.itilstatus.canceled { color: #498abf !important; }');
        }

        GM_addStyle('.text-solved { color: #498abf !important; }');
        GM_addStyle('.text-waiting { color: orange !important; }');
        GM_addStyle('.text-assigned { color: #49bf4d !important; }');

        GM_addStyle('.bg-solved { background-color: #498abf !important; }');
        GM_addStyle('.bg-waiting { background-color: orange !important; }');
        GM_addStyle('.bg-assigned { background-color: #49bf4d !important; }');
    }


    // HOME

    // titles
    if(true)
    {
        GM_addStyle('table.card-table thead th a { font-size: 125% !important; }');
        GM_addStyle('table.card-table thead th a span.primary-bg { border-radius: 4px !important; }');

    }
    if(style_auror_dark)
    {
        GM_addStyle('table.card-table thead th a span.primary-bg { background-color: #fec95c !important; color: #232e3c !important; }');
        GM_addStyle('div.masonry_grid div.grid-item a span.badge.bg-secondary { background-color: #fec95c !important; color: #232e3c !important; }');
    }

    // search results (global search)
    if(true)
    {
        GM_addStyle('div.search-container.w-100:not(:first-child) { margin-top: 25px !important; }');
    }


    // TICKET OVERVIEW

    // search, filters, actions, pages
    if(true)
    {
        GM_addStyle('div.card-header { padding: 5px 1.25rem !important; }');
        GM_addStyle('div.card-footer { padding: 5px 1.25rem !important; }');
        GM_addStyle('div.search-pager { margin-bottom: 0px !important; }');

        GM_addStyle('table.search-results thead:first-child th { top: 41px !important; }');

        if(GM_config.get('custom_overview_dashboard') == true)
        {
            GM_addStyle('div.search-container div.dashboard-card { display: none !important; }');
        }
    }



    // SINGLE TICKET

    // ticket information
    if(true)
    {
        // custom elements
        GM_addStyle('.custom-element.custom-el-information { border-bottom-width: 1px !important; }');
        GM_addStyle('.custom-element.custom-el-information label.col-form-label { padding-top: 0px !important; }');
        GM_addStyle('.custom-element.custom-el-information h3 { padding-left: 24px !important; text-indent: -12px !important; }');
        GM_addStyle('.custom-element.custom-el-information h3 span.status { padding: 0.25rem !important; height: auto !important; text-indent: 0px !important; }');
        GM_addStyle('.custom-element.custom-el-information-title { top: -6px !important; }');
        GM_addStyle('.custom-element.custom-el-opening { padding: 10px 100px 10px 30px !important; }');


        GM_addStyle('.custom-element span.glpi-badge { flex-wrap: nowrap !important; }');
        GM_addStyle('.custom-element span.glpi-badge i.ti { margin-right: 3px !important; }');
        GM_addStyle('.custom-element span.glpi-badge i.ti.fa-fw { margin-right: 8px !important; }');

        GM_addStyle('.custom-element.custom-el-information-support span.custom-support-button button { font-size: 75% !important; min-height: auto !important; }');

        // titles
        GM_addStyle('div.accordion-item h2.accordion-header button.accordion-button.collapsed { background-color: rgb(0,0,0,0.1) !important; }');

        // actors
        GM_addStyle('div.accordion-item button.edit-notify-user i.notify-icon.fas.fa-bell { color: #54b446 !important; }');
        GM_addStyle('div.accordion-item button.edit-notify-user i.notify-icon.far.fa-bell { color: #e64f3c !important; }');

        // items
        GM_addStyle('div#items a.btn { margin-bottom: 10px !important; }');
        GM_addStyle('div.list-group-item { padding: 5px 1.25rem !important; }');
        GM_addStyle('div.list-group-item span.list-group-item-title { min-width: 90px; display: inline-block; font-size: 0.65rem !important; }');
        GM_addStyle('div.list-group-item span.fa-info { margin-left: 5px; }');
        GM_addStyle('div.list-group-item i.fa-times-circle { margin-top: 5px; float: right; color: #d63939 !important; }');
        GM_addStyle('div.list-group-item.list-group-item-nnn { opacity: 0.5 !important; }');
        GM_addStyle('div.list-group-item.list-group-item-nnn:hover { opacity: 1 !important; }');

        GM_addStyle('div.accordion-items > div > div.input-group span.input-group-text { min-width: 175px !important; }');
        GM_addStyle('div.accordion-items > div > div.input-group span.select2 { min-width: 175px !important; }');
        GM_addStyle('div.accordion-items > div > div.input-group:not(:first-child) span:nth-of-type(3) { display: flex; }');
        GM_addStyle('div.accordion-items > div > div.input-group:not(:first-child) span:nth-of-type(3) span.ms-1 { margin-left: 0.5rem !important; margin-top: 0.5rem !important; }');
        GM_addStyle('div.tab-content > div.tab-pane > div.firstbloc div.input-group span.input-group-text { min-width: 175px !important; }');
        GM_addStyle('div.tab-content > div.tab-pane > div.firstbloc div.input-group span.select2 { min-width: 175px !important; }');
        GM_addStyle('div.tab-content > div.tab-pane > div.firstbloc div.input-group:not(:first-child) span:nth-of-type(3) { display: flex; }');
        GM_addStyle('div.tab-content > div.tab-pane > div.firstbloc div.input-group:not(:first-child) span:nth-of-type(3) span.ms-1 { margin-left: 0.5rem !important; margin-top: 0.5rem !important; }');

        // tickets
        GM_addStyle('div#linked_tickets span.select2 { min-width: 175px !important; }');

        // tabs
        GM_addStyle('div.tab-pane table { font-size: 0.75rem; }');


        GM_addStyle('.background-brightness-dark { color: #FFFFFF; }');
        GM_addStyle('.background-brightness-light { color: #000000; }');
    }
    if(style_auror_dark)
    {
        GM_addStyle('h2.accordion-header span.badge { background-color: #fec95c !important; color: #232e3c !important; }');

        GM_addStyle('div.accordion-item button i.fa-male { color: #fec95c !important; }');
    }

    // form
    if(true)
    {
        GM_addStyle('form[name="asset_form"] div.card-footer { padding: 10px 1.25rem !important; min-height: auto !important; }');
    }

    // footer
    if(true)
    {
        GM_addStyle('.card-footer .btn-group > .btn:not(:first-child), .card-footer .btn-group > .btn-group:not(:first-child) { margin-left: 2px !important; }');
    }


    // 'avatar' text (initials)
    if(style_auror_dark || style_darker || style_midnight)
    {
        GM_addStyle('span.avatar { color: #EEEEEE; border: 1px solid #666666; }');
    }

    // followups
    if(true)
    {
        // followup: public
        GM_addStyle('div.ITILFollowup .timeline-content { background-position: right 20px; }');

        // followup: private
        GM_addStyle('div.ITILFollowup .timeline-content.h_content_private { background-position: right 20px; }');
        GM_addStyle('div.ITILFollowup .timeline-content.h_content_private.content_ticketsync { background-color: #CCCCCC !important; background-image: none; }');
        GM_addStyle('div.ITILFollowup .timeline-content.h_content_private.content_ticketsync div.read-only-content { color: #777777; }');
        GM_addStyle('div.ITILFollowup .timeline-content.h_content_private.content_ticketsync div.read-only-content div.rich_text_container { font-style: italic; font-size: 95%; }');

        // followup: task
        GM_addStyle('div.ITILTask div.content-part .timeline-content { background-color: #ffe8b9 !important; background-image: url("../pics/timeline/task.png") !important; background-position: 98% 45px; border-radius: 5px; }');
        GM_addStyle('div.ITILTask div.content-part .timeline-content.t-left { border-right: 5px solid #f76707 !important; }');
        GM_addStyle('div.ITILTask div.content-part .timeline-content.t-right { border-left: 5px solid #f76707 !important; }');
        GM_addStyle('div.ITILTask.done div.content-part .timeline-content.t-left { border-right-color: #2fb344 !important; }');
        GM_addStyle('div.ITILTask.done div.content-part .timeline-content.t-right { border-left-color: #2fb344 !important; }');
        GM_addStyle('div.ITILTask div.content-part .timeline-content i.ti.ti-lock { color: #38301f !important; }');
        GM_addStyle('div.ITILTask div.todo-list-state span.state { background-color: #f76707 !important; background-position: center !important; border-radius: 3px; border: 3px solid #f76707 !important; }');
        GM_addStyle('div.ITILTask.done div.todo-list-state span.state { background-color: #2fb344 !important; border-color: #2fb344 !important; }');

        // followup: badge
        GM_addStyle('div.timeline-item .timeline-content div.creator { display: block !important; min-width: 25%; }');
        GM_addStyle('div.timeline-item .timeline-content div.creator span.badge { display: block !important; text-align: left; margin: 0px 0px 3px 0px !important; white-space: nowrap !important; }');
        GM_addStyle('div.timeline-item .timeline-content div.timeline-badges { margin-top: 15px !important; }');
        GM_addStyle('div.timeline-item .timeline-content div.timeline-badges .badge.bg-blue-lt { background-color: rgba(0,0,0,0.15) !important; margin-bottom: 5px !important; padding: 0.5rem !important; display: block !important; }');
        GM_addStyle('div.timeline-item .timeline-content div.timeline-badges .badge { text-align: left !important; }');
        GM_addStyle('div.timeline-item .timeline-content div.timeline-badges .badge > .badge { margin: 10px 0px 0px 0px !important; background-color: rgba(104, 104, 104, 0.15); display: block !important; }');
        GM_addStyle('div.timeline-item .timeline-content div.timeline-badges .badge > .badge a { color: #3a5693; }');
        GM_addStyle('div.timeline-item .timeline-content div.timeline-badges .badge > .badge a:hover { color: #2e4576; }');

        // followup: documents
        GM_addStyle('div.timeline-item div.sub-documents { margin: 3px 0px 20px; padding: 20px 10px 10px !important; background-color: #f5f7fb !important; border: 1px solid rgba(98, 105, 118, 0.16); }');
        GM_addStyle('div.timeline-item div.sub-documents .list-group-item { margin-bottom: 10px; background-color: transparent !important; }');
        // followup: documents
        GM_addStyle('div.Document_Item div.content-part .timeline-content { background-color: #f5f7fb !important; }');

        // followup: read more
        GM_addStyle('.rich_text_container .long_text .read_more .read_more_button { padding: 25px 0px 5px 0px; left: 0px !important; bottom: 0px !important; width: 100%;  }');

        // history
        GM_addStyle('div.timeline-item.ITILFollowup.Log div.user-part  { margin-left: 25px; display: flex !important; }');
        GM_addStyle('div.timeline-item.ITILFollowup.Log div.content-part  { margin-left: 0px; }');
        GM_addStyle('div.timeline-item.ITILFollowup.Log div.timeline-content div.card-body { padding: 0.5rem 1.25rem; border: 1px solid #2f3d50; display: block; }');
        GM_addStyle('div.timeline-item.ITILFollowup.Log div.timeline-content div.card-body div.timeline-header { margin: 0px 0px 0.5rem 0px; }');
        GM_addStyle('div.timeline-item.ITILFollowup.Log div.timeline-content div.card-body div.timeline-badges { margin: 0px !important; }');

        // form followup
        GM_addStyle('div#new-itilobject-form div.itilfollowup div.row div.col-12 { width: 100%; }');
        GM_addStyle('div.ITILFollowup .timeline-content div.edit-content div.row div.col-12 { width: 100%; }');
        // form task
        GM_addStyle('div#new-TicketTask-block div.itiltask div.row div.col-12 { width: 100%; }');
        GM_addStyle('div.ITILTask .timeline-content div.edit-content div.row div.col-12 { width: 100%; }');
        // form solution
        GM_addStyle('div#new-itilobject-form div.itilsolution div.row div.col-12 { width: 100%; }');

        // form title
        GM_addStyle('div.timeline-item span.followup-name { display: inline-flex; align-items: center; font-weight: bold; padding: 0.125rem 1rem; }');
        GM_addStyle('div.timeline-item span.followup-name i.ti { margin-right: 0.25rem; }');

        // custom elements
        GM_addStyle('.custom-element { background-color: #f5f7fb !important; }');
    }
    if(style_auror_dark || style_darker || style_midnight)
    {
        // followup: public
        GM_addStyle('div.ITILFollowup .timeline-content { background-color: #203723 !important; color: #85bd81 !important; }');
        GM_addStyle('div.ITILFollowup .timeline-content div.read-only-content { color: #85bd81; }');

        // followup: task
        GM_addStyle('div.ITILTask div.content-part .timeline-content { background-color: #3b2f17 !important; }');
        GM_addStyle('div.ITILTask div.content-part .timeline-content i.ti.ti-lock { color: #9ca8c0 !important; }');

        // followup: badge
        GM_addStyle('div.timeline-item .timeline-content div.creator span.badge span:last-of-type a { color: #fec95c; }');
        GM_addStyle('div.timeline-item .timeline-content div.creator span.badge span:last-of-type a:hover { color: #e5b553; }');
        GM_addStyle('div.timeline-item .timeline-content div.timeline-badges .badge.bg-blue-lt { color: #FFFFFF !important; }');
        GM_addStyle('div.timeline-item .timeline-content div.timeline-badges .badge > .badge a { color: #fec95c; }');
        GM_addStyle('div.timeline-item .timeline-content div.timeline-badges .badge > .badge a:hover { color: #e5b553; }');

        // followup: read more
        GM_addStyle('.rich_text_container .long_text .read_more { background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #85bd81 200%); }');
        GM_addStyle('.rich_text_container .long_text .read_more .read_more_button { color: #FFFFFF; }');
        GM_addStyle('.rich_text_container .long_text .read_more .read_more_button:hover { background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #FFFFFF 200%); }');

        // solution
        GM_addStyle('div.ITILSolution .timeline-content { background-color: #175169 !important; }');

    }
    if(style_auror_dark)
    {
        // followup: private
        GM_addStyle('div.ITILFollowup .timeline-content.h_content_private { background-color: #2a3a4f !important; color: #9ca8c0 !important; }');
        GM_addStyle('div.ITILFollowup .timeline-content.h_content_private div.read-only-content { color: #9ca8c0; }');
        GM_addStyle('div.ITILFollowup .timeline-content.h_content_private.content_ticketsync { background-color: #333333 !important; }');
        GM_addStyle('div.ITILFollowup .timeline-content.h_content_private.content_ticketsync div.read-only-content { color: #777777; }');
        GM_addStyle('div.ITILFollowup .timeline-content.h_content_private span.is-private i.ti-lock { color: #9ca8c0; }');

        // followup: documents
        GM_addStyle('div.timeline-item div.sub-documents { background-color: #1d2531 !important; }');
        // followup: documents
        GM_addStyle('div.Document_Item div.content-part .timeline-content { background-color: #1d2531 !important; }');

        // followup: link
        GM_addStyle('.rich_text_container a { color: #fec95c; }');
        GM_addStyle('.rich_text_container a:hover { color: #e5b553; }');

        // custom elements
        GM_addStyle('.custom-element { background-color: #1d2531 !important; }');

        // external link
        GM_addStyle('span.form-control-plaintext a { color: #fec95c; }');
        GM_addStyle('span.form-control-plaintext a:hover { color: #e5b553; }');
        GM_addStyle('span.glpi-badge.external-link a { color: #fec95c; }');
        GM_addStyle('span.glpi-badge.external-link a:hover { color: #e5b553; }');


        // search field
        GM_addStyle('input.select2-search__field { color: #fec95c !important; }');

    }
    if(style_darker || style_midnight)
    {
        // followup: private
        GM_addStyle('div.ITILFollowup .timeline-content.h_content_private { background-color: #3a3938 !important; }');
        GM_addStyle('div.ITILFollowup .timeline-content.h_content_private div.read-only-content { color: #aaaaaa; }');
        GM_addStyle('div.ITILFollowup .timeline-content.h_content_private.content_ticketsync { background-color: #222222 !important; }');
        GM_addStyle('div.ITILFollowup .timeline-content.h_content_private.content_ticketsync div.read-only-content { color: #777777; }');
        GM_addStyle('div.ITILFollowup .timeline-content.h_content_private span.is-private i.ti-lock { color: #aaaaaa; }');

        // followup: documents
        GM_addStyle('div.timeline-item div.sub-documents { background-color: #1f1e1e !important; }');
        // followup: documents
        GM_addStyle('div.Document_Item div.content-part .timeline-content { background-color: #1f1e1e !important; }');

        // custom elements
        GM_addStyle('.custom-element { background-color: #1f1e1e !important; }');
    }

}

// ***********************************************
// Edit single ticket CSS
// ***********************************************
function editTicketSingleCSS(ticket_navigationheader_shown = true)
{
    // current layout
    var page_menu_header = !($('body').hasClass('vertical-layout'));
    var page_menu_side = $('body').hasClass('vertical-layout');

    if(page_menu_header)
    {
        if(ticket_navigationheader_shown)
        {
            GM_addStyle('.horizontal-layout .itil-object { height: calc(100vh - 235px) !important; }');
        }
        else
        {
            GM_addStyle('.horizontal-layout .itil-object { height: calc(100vh - 189px) !important; }');
        }
    }
    else
    {
        if(ticket_navigationheader_shown)
        {
            GM_addStyle('.vertical-layout .itil-object { height: calc(100vh - 180px) !important; }');
        }
        else
        {
            GM_addStyle('.vertical-layout .itil-object { height: calc(100vh - 133px) !important; }');
        }
    }
}

// ***********************************************
// Edit login
// ***********************************************
function editLogin()
{
    // dark mode
    /*
    if(GM_config.get('custom_login_dark_mode') == true)
    {
        $('link[href*="auror"]').attr('href',$('link[href*="auror"]').attr('href').replace('auror', 'auror_dark'));
    }
    */

    // change css style
    if(GM_getValue('custom_css_style_path','').length > 0)
    {
        var style_path = $('link[href*="css_palettes_auror"]').attr('href');
        var style_path_version = $('link[href*="css_palettes_auror"]').attr('href').substring(style_path.indexOf('?v='));

        $('link[href*="css_palettes_auror"]').attr('href',GM_getValue('custom_css_style_path')+style_path_version);
    }

    // change default + O365 buttons
    $('button[name="samlIdpId"]').parent().removeClass('col-sm-6').addClass('col-sm-12');
    $('button[name="samlIdpId"]').parents('div.justify-content-center').find('button.btn-primary').removeClass('btn-primary').addClass('btn-light');
    $('button[name="samlIdpId"]').removeClass('btn-light').addClass('btn-primary w-100');

    GM_setValue('custom_url_after_login',window.location.href);
}

// ***********************************************
// Edit redirect after login
// ***********************************************
function editLoginRedirect()
{
    //var page_url = window.location.href;
    var page_url = GM_getValue('custom_url_after_login');
    GM_setValue('custom_url_after_login','');

    var page_redirect = page_url.substring(page_url.indexOf('redirect=')+'redirect='.length);
    window.location = 'https://' + window.location.hostname + '/index.php?redirect=' + page_redirect;
}

// ***********************************************
// Edit home
// ***********************************************
function editHome(jNode)
{
    // CHANGE TABLE LAYOUT of tab_cadrehov
    var thead_rows;

    // move table headers to thead
    if($('table.tab_cadrehov thead').length == 0)
    {
        thead_rows = $('table.tab_cadrehov').find("tr:has(th)");

        $('table.tab_cadrehov').prepend('<thead></thead>');
        $('table.tab_cadrehov thead').append(thead_rows.clone(true));

        thead_rows.remove();
    }

    // change layout
    $('table.tab_cadrehov').removeClass('tab_cadrehov').addClass('table table-borderless table-striped table-hover card-table');
    $('table.table:not(.card-table)').removeClass('tab_cadrehov').addClass('table table-borderless table-striped table-hover card-table');


    // CHANGE TABLE LAYOUT of tab_cadre_fixe

    // move table headers to thead
    if($('table.tab_cadre_fixe thead').length == 0)
    {
        thead_rows = $('table.tab_cadre_fixe').find("tr:has(th)");

        $('table.tab_cadre_fixe').prepend('<thead></thead>');
        $('table.tab_cadre_fixe thead').append(thead_rows.clone(true));

        thead_rows.remove();
    }

    // change layout
    $('table.tab_cadre_fixe').removeClass('tab_cadre_fixe').addClass('table table-borderless table-striped table-hover card-table');
    $('table.table:not(.card-table)').removeClass('tab_cadre_fixe').addClass('table table-borderless table-striped table-hover card-table');


    // PROCESS SINGLE (unprocessed) TABLE
    $('table.card-table:not(.plus-processed)').each(function(){

        // SURROUNDING

        // remove centering class
        $(this).parent('.center').removeClass('center');


        // HEADERS

        // add column for numbers (after description)
        var column_description;

        if($(this).find('th:contains("Beschrijving")').length)
        {
            column_description = $(this).find('> thead > tr:nth-child(2) > th:contains("Beschrijving")').index() + 1;
        }
        else if($(this).find('th:contains("Titel")').length)
        {
            column_description = $(this).find('> thead > tr:nth-child(2) > th:contains("Titel")').index() + 1;
        }

        if(column_description > 0)
        {
            $(this).find('> thead > tr:not(:first-child)').find('> th:nth-child('+column_description+')').after('<th>#</th>');
            $(this).find('> tbody > tr').find('> td:nth-child('+column_description+')').after('<td></td>');

            $(this).find('> thead > tr:first-child > th').attr('colspan', parseInt($(this).find('> thead > tr:first-child > th').attr('colspan')) + 1);
        }

        // shorten the table headers
        $(this).find('> thead > tr:not(:first-child) > th').each(function(){
            $(this).text($(this).text().replace(/Geassocieerde elementen/gi,'Items'));
        });

        if(GM_config.get('custom_overview_entity') == true)
        {
            // hide entiteit column
            var column_entity = $(this).find('> thead > tr:nth-child(2) > th:contains("Entiteiten")').index() + 1;

            $(this).find('thead tr th:nth-child('+column_entity+')').hide();
            $(this).find('tbody tr td:nth-child('+column_entity+')').hide();
        }

        if(true)
        {
            // hide planning column
            var column_plan = $(this).find('> thead > tr:nth-child(2) > th:contains("Planning")').index() + 1;

            $(this).find('> thead > tr:not(":first") > th:nth-child('+column_plan+')').hide();
            $(this).find('> tbody > tr > td:nth-child('+column_plan+')').hide();

            // hide first (empty) column
            var column_first = $(this).find('> thead > tr:nth-child(1)').index()+1;

            if($(this).find('> thead > tr:not(":first") > th:nth-child('+column_first+')').text().trim().length == 0)
            {
                $(this).find('> thead > tr:not(":first") > th:nth-child('+column_first+')').hide();
                $(this).find('> tbody > tr > td:nth-child('+column_first+')').hide();
            }

        }

        if(GM_config.get('custom_overview_info') == true)
        {
            // hide info icon (popup)
            $(this).find('tbody td span.fas.fa-info').hide();
        }


        // PRIORITY

        // find
        var column_priority;

        if($(this).find('th:contains("ID")').length)
        {
            column_priority = $(this).find('> thead > tr:nth-child(2) > th:contains("ID")').index() + 1;

            // change markup
            $(this).find('> tbody > tr > td:nth-child('+column_priority+')').each(function(){
                var priority_string = '';

                var priority_color = $(this).find('div.priority_block').css('border-color');
                var priority_name = $(this).find('div.priority_block').text();
                priority_name = priority_name.substring(priority_name.lastIndexOf(':')+2)

                priority_string = priority_string + '<span class="glpi-badge mt-1">';
                priority_string = priority_string + '<i class="fas fa-circle me-1" style="color: '+priority_color+' !important; "></i>'
                priority_string = priority_string + priority_name;
                priority_string = priority_string + '</span><br> ';

                $(this).empty();
                $(this).append(priority_string);
            });
        }
        else if($(this).find('th:contains("Prioriteit")').length)
        {
            column_priority = $(this).find('> thead > tr:nth-child(2) > th:contains("Prioriteit")').index() + 1;

            // change markup
            $(this).find('> tbody > tr > td:nth-child('+column_priority+')').each(function(){
                var priority_string = '';

                var priority_color = $(this).attr('bgcolor');
                var priority_name = $(this).text();

                priority_string = priority_string + '<span class="glpi-badge mt-1">';
                priority_string = priority_string + '<i class="fas fa-circle me-1" style="color: '+priority_color+' !important; "></i>'
                priority_string = priority_string + priority_name;
                priority_string = priority_string + '</span><br> ';

                $(this).empty();
                $(this).append(priority_string);
            });
        }


        // STATUS

        // find
        var column_status = $(this).find('> thead > tr:nth-child(2) > th:contains("Status")').index() + 1;

        // change markup
        $(this).find('> tbody > tr > td:nth-child('+column_status+')').each(function(){
            var status_string = '';
            var status_icon = $(this).find('i.itilstatus').clone();
            var status_id = $(this).text();
            status_id = status_id.substring(status_id.lastIndexOf(':')+2)

            status_string = status_string + '<span class="glpi-badge mt-1">';
            status_string = status_string + status_id;
            status_string = status_string + '</span> ';

            $(this).empty();
            $(this).append(status_string);
            $(this).find('span.glpi-badge').prepend(status_icon);
        });


        // REQUESTER

        // find
        var column_requester = $(this).find('> thead > tr:nth-child(2) > th:contains("Aanvrager")').index() + 1;

        // change markup
        $(this).find('> tbody > tr > td:nth-child('+column_requester+')').each(function(){
            var requester_string = '';

            if($(this).find('span.b').length)
            {
                var elem = $(this).find('span.b').text();

                if(elem.length > 0)
                {
                    requester_string = requester_string + '<span class="glpi-badge mt-1">';
                    requester_string = requester_string + elem.replace(' &gt; ','&gt;');

                    requester_string = requester_string + '</span>';
                }
            }
            else if($(this).text() != "")
            {
                var requester_lines = $(this).html().split("<br>");
                var group_regex;

                $.each(requester_lines, function(n, elem){

                    // shorten the text
                    $.each(groups_short, function(group_short, group_long){
                        group_regex = new RegExp(group_long, 'gi');

                        elem = elem.replace(group_regex,group_short);
                    });

                    requester_string = requester_string + '<span class="glpi-badge mt-1">';
                    requester_string = requester_string + elem.replace(' &gt; ','&gt;');

                    requester_string = requester_string + '</span><br> ';
                });
            }

            $(this).empty();
            $(this).append(requester_string);
        });


        // LINKED ITEMS
        // limit number of linked items

        // find
        var column_items = $(this).find('> thead > tr:nth-child(2) > th:contains("Items")').index() + 1;
        var max_items = 2;

        // limit and change markup
        $(this).find('> tbody > tr > td:nth-child('+column_items+')').each(function(){
            var items_string = '';
            var items_total = parseInt($(this).find('span a').length);

            if(items_total > 0)
            {
                var items_index = 0;
                $(this).find('span a').each(function(){
                    items_index++;

                    if(items_index <= max_items || GM_config.get('custom_overview_linked') == false)
                    {
                        var item_name = $(this).attr('title');
                        var item_link = $(this).attr('href');
                        var item_badge_nnn = '';

                        if($(this).attr('href').indexOf('peripheral.form.php?id=10982') >= 1)
                        {
                            item_name = 'NNN'
                            item_badge_nnn = 'glpi-badge-nnn';
                        }

                        items_string = items_string + '<span class="glpi-badge '+item_badge_nnn+' mt-1">';
                        items_string = items_string + '<a href="'+item_link+'" title="'+item_name+'">'+item_name+'</a>';
                        items_string = items_string + '</span><br> ';
                    }
                });
            }

            if(items_total > max_items && GM_config.get('custom_overview_linked') == true)
            {
                var items_extra = items_total-max_items;
                items_string = items_string + '<span class="glpi-badge mt-1">+';
                items_string = items_string + items_extra;
                items_string = items_string + '</span>';
            }

            $(this).empty();
            $(this).append(items_string);
        });


        // DESCRIPTION

        // find
        var column_numbers = $(this).find('> thead > tr:nth-child(2) > th:contains("#")').index() + 1;

        if(column_description)
        {
            // get numbers
            $(this).find('> tbody > tr > td:nth-child('+column_description+')').each(function(){
                var numbers_array = $(this).html().match(/\(\d+ - \d+\)/gi);

                if(numbers_array !== null && numbers_array.length)
                {
                    var numbers_string = numbers_array[0].replace(/[^0-9-]/gi, '');

                    // remove numbers this column
                    $(this).html($(this).html().replace(/\(\d+ - \d+\)/gi,''));

                    // add numbers to other column
                    $(this).parent().find('> td:nth-child('+column_numbers+')').append('<span class="glpi-badge mt-1">'+numbers_string+'</span> ');
                }
            });
        }


        // IDS

        // remove ids
        $(this).html($(this).html().replace(/\(\d+\)/gi,''));


        // MARK TABLE AS PROCESSED
        $(this).addClass('plus-processed');
    });

    // WIDTH
    $('table.card-table tr:nth-child(2) th:contains("Status")').attr('width','80');
    $('table.card-table tr:nth-child(2) th:contains("Datum")').attr('width','140');
    $('table.card-table tr:nth-child(2) th:contains("Update")').attr('width','140');
    $('table.card-table tr:nth-child(2) th:contains("Prioriteit")').attr('width','100');
    $('table.card-table tr:nth-child(2) th:contains("Titel")').attr('width','500');

}

// ***********************************************
// Edit search
// ***********************************************
function editSearch(jNode)
{
    // PROCESS SINGLE (unprocessed) TABLE
    $('table.search-results:not(.plus-processed)').each(function(){

        if(GM_config.get('custom_overview_entity') == true)
        {
            // hide entiteit column
            var column_entity = $(this).find('> thead tr th:contains("Entiteit")').index() + 1;

            $(this).find('> thead tr th:nth-child('+column_entity+')').hide();
            $(this).find('> tbody tr td:nth-child('+column_entity+')').hide();
        }

        // MARK TABLE AS PROCESSED
        $(this).addClass('plus-processed');
    });



    var url = window.location;
    let params = new URLSearchParams(url.search);
    let searchterm_available = params.has('globalsearch');

    if(searchterm_available)
    {
        var searchterm = params.get('globalsearch');

        // PROCESS SINGLE (unprocessed) HEADER
        $('div.search-card h2:not(.plus-processed)').each(function(){
            $(this).html($(this).html() + ' <span style="font-weight: normal; margin-left: 10px;">[zoekterm: '+searchterm+']</Span>');

            // MARK TABLE AS PROCESSED
            $(this).addClass('plus-processed');
        });
    }


}

// ***********************************************
// Edit overview tickets
// ***********************************************
function editTicketOverview(jNode)
{
    // HEADER

    // shorten the table headers
    $('table.search-results thead th').each(function(){
        $(this).attr('title', $(this).text().trim());

        $(this).text($(this).text().replace(/Aanvrager - Aanvrager/gi,'Aanvrager'));
        $(this).text($(this).text().replace(/Followups - Aantal vervolgacties/gi,'Updates'));
        $(this).text($(this).text().replace(/Geassocieerde elementen/gi,'Items'));
        $(this).text($(this).text().replace(/Laatst aangepast door/gi,'Updater'));
        $(this).text($(this).text().replace(/Plugins - Tickets - Extern ticket/gi,'Extern ticket'));
        $(this).text($(this).text().replace(/Plugins - Tickets - Locatie/gi,'Locatie'));
        $(this).text($(this).text().replace(/Toegekend aan - Technici groep/gi,'Groep'));
        $(this).text($(this).text().replace(/Toegekend aan - Technicus/gi,'Technicus'));
        $(this).text($(this).text().replace(/Toegekend aan - Toegewezen aan leverancier/gi,'Leverancier'));
        $(this).text($(this).text().replace(/Volger - Volger/gi,'Volger'));
    });

    if(GM_config.get('custom_overview_entity') == true)
    {
        // hide entiteit column
        var column_entity = $('table.search-results thead tr th[data-searchopt-id="80"]').index() + 1;

        $('table.search-results thead tr th:nth-child('+column_entity+')').hide();
        $('table.search-results tbody tr td:nth-child('+column_entity+')').hide();
    }

    if(GM_config.get('custom_overview_info') == true)
    {
        // hide info icon (popup)
        $('table.search-results tbody td span.fas.fa-info').hide();
    }


    // DATES
    // highlight today
    if(GM_config.get('custom_overview_highlight_dates') == true)
    {
        var column_date_start = $('table.search-results thead tr th[data-searchopt-id="15"]').index() + 1;
        var column_date_update = $('table.search-results thead tr th[data-searchopt-id="19"]').index() + 1;

        var date_check = '';

        var date_today = new Date();
        var date_today_dd = date_today.getDate();
        var date_today_mm = date_today.getMonth() + 1;
        var date_today_yy = date_today.getFullYear();
        date_today = [date_today_dd<10 ? '0'+date_today_dd : date_today_dd, date_today_mm<10 ? '0'+date_today_mm : date_today_mm, date_today_yy].join('-');

        var date_yesterday = new Date();
        date_yesterday.setDate(date_yesterday.getDate() - 1);

        var date_yesterday_dd = date_yesterday.getDate();
        var date_yesterday_mm = date_yesterday.getMonth() + 1;
        var date_yesterday_yy = date_yesterday.getFullYear();
        date_yesterday = [date_yesterday_dd<10 ? '0'+date_yesterday_dd : date_yesterday_dd, date_yesterday_mm<10 ? '0'+date_yesterday_mm : date_yesterday_mm, date_yesterday_yy].join('-');

        // change markup
        $('table.search-results tbody tr td:nth-child('+column_date_start+')').each(function(){
            date_check = $(this).text();
            date_check = date_check.split(' ')[0];

            if(date_check == date_today)
            {
                $(this).find('span').addClass('itilstatus assigned');
            }
            if(date_check == date_yesterday)
            {
                $(this).find('span').addClass('itilstatus waiting');
            }
        });
        $('table.search-results tbody tr td:nth-child('+column_date_update+')').each(function(){
            date_check = $(this).text();
            date_check = date_check.split(' ')[0];

            if(date_check == date_today)
            {
                $(this).find('span').addClass('itilstatus assigned');
            }
            if(date_check == date_yesterday)
            {
                $(this).find('span').addClass('itilstatus waiting');
            }
        });
    }


    // LINKED ITEMS
    // limit number of linked items

    // find
    var column_items = $('table.search-results thead tr th[data-searchopt-id="13"]').index() + 1;
    var max_items = 2;

    // limit and change markup
    $('table.search-results tbody tr td:nth-child('+column_items+')').each(function(){
        var items_string = '';
        var items_total = parseInt($(this).find('a').length);

        if(items_total > 0)
        {
            var items_index = 0;
            $(this).find('a').each(function(){
                items_index++;

                if(items_index <= max_items || GM_config.get('custom_overview_linked') == false)
                {
                    var item_name = $(this).attr('title');
                    var item_link = $(this).attr('href');
                    var item_badge_nnn = '';

                    if($(this).attr('href').indexOf('peripheral.form.php?id=10982') >= 1)
                    {
                        item_name = 'NNN'
                        item_badge_nnn = 'glpi-badge-nnn';
                    }

                    items_string = items_string + '<span class="glpi-badge '+item_badge_nnn+' mt-1">';
                    items_string = items_string + '<a href="'+item_link+'" title="'+item_name+'">'+item_name+'</a>';
                    items_string = items_string + '</span> ';

                    if(GM_config.get('custom_overview_linked') == false)
                    {
                        items_string = items_string + '<br>';
                    }
                }
            });
        }

        if(items_total > max_items && GM_config.get('custom_overview_linked') == true)
        {
            var items_extra = items_total-max_items;
            items_string = items_string + '<span class="glpi-badge mt-1">+';
            items_string = items_string + items_extra;
            items_string = items_string + '</span> ';
        }

        $(this).empty();
        $(this).append(items_string);
    });


    // STATUS

    // find
    var column_status = $('table.search-results thead tr th[data-searchopt-id="12"]').index() + 1;

    // shorten the text "Bezig met verwerken"
    $("table.search-results").html($("table.search-results").html().replace(/Bezig met verwerken \(toegewezen\)|Bezig met verwerken \(gepland\)/gi,'Bezig'));

    // change markup
    $('table.search-results tbody tr td:nth-child('+column_status+')').each(function(){
        var status_string = '';
        var status_color = $(this).find('i.itilstatus').css('color');

        status_string = status_string + '<span class="glpi-badge mt-1" style="color: '+status_color+' !important;">';
        status_string = status_string + $(this).html();
        status_string = status_string + '</span> ';

        $(this).empty();
        $(this).append(status_string);
    });


    // GROUPS

    // find
    var column_groups = $('table.search-results thead tr th[data-searchopt-id="8"]').index() + 1;
    var group_regex;

    // shorten the text
    $.each(groups_short, function(group_short, group_long){
        group_regex = new RegExp(group_long, 'gi');

        $("table.search-results").html($("table.search-results").html().replace(group_regex,group_short));
    });
    
    // re-replace 'helpdesk' > 'HD' > 'helpdesk' in URL's
    $("table.search-results").html($("table.search-results").html().replace(/\/HD\//g,'/helpdesk/'));

    // change markup
    $('table.search-results tbody tr td:nth-child('+column_groups+')').each(function(){
        var group_string = '';

        if($(this).text() != "")
        {
            var group_lines = $(this).html().split("<br>");

            $.each(group_lines, function(n, elem){
                group_string = group_string + '<span class="glpi-badge mt-1">';
                group_string = group_string + elem.replace(' &gt; ','&gt;');
                group_string = group_string + '</span><br> ';
            });
        }

        $(this).empty();
        $(this).append(group_string);

    });


    // PRIORITY

    // find
    var column_priority = $('table.search-results thead tr th[data-searchopt-id="3"]').index() + 1;

    // change markup
    $('table.search-results tbody tr td:nth-child('+column_priority+')').each(function(){
        var priority_string = '';

        var priority_color = $(this).find('div.priority_block').css('border-color');
        var priority_name = $(this).find('div.priority_block').text();

        priority_string = priority_string + '<span class="glpi-badge mt-1">';
        priority_string = priority_string + '<i class="fas fa-circle me-1" style="color: '+priority_color+' !important; "></i>'
        priority_string = priority_string + priority_name;
        priority_string = priority_string + '</span><br> ';

        $(this).empty();
        $(this).append(priority_string);
    });


    // TYPE

    // find
    var column_type = $('table.search-results thead tr th[data-searchopt-id="14"]').index() + 1;

    var el_ticket_type_incident = '<span class="glpi-badge"><span class="text-warning"><i class="far fa-life-ring me-1"></i> Incident</span></span>';
    var el_ticket_type_request = '<span class="glpi-badge"><span class="text-info"><i class="far fa-question-circle me-1"></i> Aanvraag</span></span>';

    // change markup
    $('table.search-results tbody tr td:nth-child('+column_type+')').each(function(){
        var type_string = '';

        if($(this).text().length > 0)
        {
            switch($(this).text())
            {
                case 'Incident':
                    type_string = el_ticket_type_incident;
                    break;

                case 'Aanvraag':
                    type_string = el_ticket_type_request;
                    break;
            }
        }

        $(this).empty();
        $(this).append(type_string);
    });


    // EXTERNAL TICKET

    // find
    var column_exernal_ticket = $('table.search-results thead tr th[data-searchopt-id="76666"]').index() + 1;

    $('table.search-results tbody tr td:nth-child('+column_exernal_ticket+')').each(function(){
        var external_ticket_id = '';
        var external_ticket_url = '';
        var external_ticket_supplier = '';

        var external_ticket_string = '';

        if($(this).text() != "")
        {
            external_ticket_url = $(this).text();

            // url
            if(external_ticket_url.indexOf('href') != -1)
            {
                external_ticket_url = external_ticket_url.substring(external_ticket_url.indexOf('>')+1, external_ticket_url.lastIndexOf('<'));
            }

            // id
            external_ticket_id = external_ticket_url.substring(external_ticket_url.lastIndexOf('/')+1);

            // supplier
            if(external_ticket_url.indexOf('tein') != -1)
            {
                external_ticket_supplier = 'Tein';
            }
            else if(external_ticket_url.indexOf('digipolis') != -1)
            {
                external_ticket_supplier = 'Digipolis';
            }
            else
            {
                external_ticket_supplier = 'Andere';
            }

            external_ticket_string = '<span class="glpi-badge mt-1"><a href="'+external_ticket_url+'">'+external_ticket_id+'</a>&nbsp;'+external_ticket_supplier+'</span>';

            $(this).empty();
            $(this).append(external_ticket_string);

        }
    });


    // IDS

    // remove ids
    $("table.search-results").html($("table.search-results").html().replace(/\(\d+\)/gi,''));


    // QTIPS

    // check for new qtips
    var MutationObserver = window.MutationObserver;
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation){
            if(mutation.type == 'childList' && typeof mutation.addedNodes == "object" && mutation.removedNodes.length == 1 && mutation.target.classList.contains('qtip-content')) //&& mutation.nextSibling == null // && mutation.addedNodes.length == 0
            {

                // select correct element
                var qtip = 'div#'+mutation.target.id;

                // remove markup
                $(qtip).find('div, p, span, a, table, tr, th, td').each(function(){
                    $(this).css('color','').css('font','').css('font-family','').css('font-size','0.8rem').css('background','').css('background-color','');
                });

                // remove information - e-balie
                if($(qtip+' span.a-badge:contains("e-balie")'))
                {
                    $(qtip+' span.a-badge:contains("e-balie")').parents('table').remove();
                    $(qtip+' div.u-margin-top').css('margin','0');
                }

                // change width if needed
                if($(qtip).innerWidth() > $(qtip).width())
                {
                    $(qtip).css('max-width','800px');
                }
            }
        });
    });
    const config = {childList: true, subtree: true};
    observer.observe(document, config);
}

// ***********************************************
// New ticket
// ***********************************************
function editTicketNew(jNode)
{
    // current style
    var style_auror_dark = false;
    var style_darker = false;
    var style_midnight = false;

    $('link[rel="stylesheet"]').each(function(){
        if($(this).attr('href').indexOf('auror_dark') !== -1)
        {
           style_auror_dark = true;
        }
        if($(this).attr('href').indexOf('darker') !== -1)
        {
           style_darker = true;
        }
        if($(this).attr('href').indexOf('midnight') !== -1)
        {
           style_midnight = true;
        }
    });

    // CUSTOM ELEMENTS
    // ticket type
    var el_ticket_type = 'Ticket';
    var el_ticket_type_id = 0;

    var el_ticket_type_incident = '<span class="glpi-badge px-2"><span class="text-warning"><i class="far fa-life-ring me-1"></i> Incident</span></span>';
    var el_ticket_type_request = '<span class="glpi-badge px-2"><span class="text-info"><i class="far fa-question-circle me-1"></i> Aanvraag</span></span>';

    el_ticket_type_id = $('select[name="type"]').find(":selected").val();

    switch(el_ticket_type_id)
    {
        case '1':
            el_ticket_type = el_ticket_type_incident;
            break;

        case '2':
            el_ticket_type = el_ticket_type_request;
            break;
    }

    // ticket type on change
    $('select[name="type"]').parent().find('span.select2-selection__rendered').on('DOMSubtreeModified', function(e){
        if($(this).text().length > 0)
        {
            switch($(this).text())
            {
                case 'Incident':
                    $('span.custom-el-information-ticket-type').html(el_ticket_type_incident);
                    break;

                case 'Aanvraag':
                    $('span.custom-el-information-ticket-type').html(el_ticket_type_request);
                    break;
            }
        }
    });


    // TICKET INFO: TICKET TYPE
    if(el_ticket_type_id > 0)
    {
        $('h2#items-heading button').append('<span class="custom-el-information-ticket-type ms-2">'+el_ticket_type+'</span>');
    }


    // TICKET INFO: ITEMS

    // on load
    editTicketSingleItemList();

    // on change
    var observer_items = new MutationObserver(function(e) {
        editTicketSingleItemList();
    });
    observer_items.observe($('div#itil-data div#items div.accordion-body')[0], {childList: true, subtree: false});

}

// ***********************************************
// Edit single ticket
// ***********************************************
function editTicketSingle(jNode)
{
    // window width
    var window_width = $(window).width();
    var window_width_limit = 992;

    // current style
    var style_auror_dark = false;
    var style_darker = false;
    var style_midnight = false;

    // supplier avatars
    var external_ticket_supplier_avatar = '';
    var external_ticket_supplier_avatar_tein = '/front/document.send.php?file=_pictures/29/61f018f9dde71c.5593137566b1fff49d329.png'; // https://glpi.politie.antwerpen.be/front/supplier.form.php?id=185
    var external_ticket_supplier_avatar_802 = '/front/document.send.php?file=_pictures/d0/61f38379634e50.5874167866b594ee988d0.jpg'; // https://glpi.politie.antwerpen.be/front/supplier.form.php?id=197
    var external_ticket_supplier_avatar_digipolis = '/front/document.send.php?file=_pictures/8d/61f02126e9e5f4.2713781466b208869838d.png'; // https://glpi.politie.antwerpen.be/front/supplier.form.php?id=2
    var external_ticket_supplier_avatar_nallo = '/front/document.send.php?file=_pictures/88/61f037267298dc.6962964266b21fc9acb88.png'; // https://glpi.politie.antwerpen.be/front/supplier.form.php?id=2

    $('link[rel="stylesheet"]').each(function(){
        if($(this).attr('href').indexOf('auror_dark') !== -1)
        {
           style_auror_dark = true;
        }
        if($(this).attr('href').indexOf('darker') !== -1)
        {
           style_darker = true;
        }
        if($(this).attr('href').indexOf('midnight') !== -1)
        {
           style_midnight = true;
        }
    });

    // CUSTOM ELEMENTS
    var el_information_content = '';
    var el_information_check = false;

    // ticket type
    var el_ticket_type = 'Ticket';
    var el_ticket_type_id = 0;

    var el_ticket_type_incident = '<span class="glpi-badge px-2"><span class="text-warning"><i class="far fa-life-ring me-1"></i> Incident</span></span>';
    var el_ticket_type_request = '<span class="glpi-badge px-2"><span class="text-info"><i class="far fa-question-circle me-1"></i> Aanvraag</span></span>';

    el_ticket_type_id = $('select[name="type"]').find(":selected").val();

    switch(el_ticket_type_id)
    {
        case '1':
            el_ticket_type = el_ticket_type_incident;
            break;

        case '2':
            el_ticket_type = el_ticket_type_request;
            break;
    }

    // ticket type on change
    $('select[name="type"]').parent().find('span.select2-selection__rendered').on('DOMSubtreeModified', function(e){
        if($(this).text().length > 0)
        {
            switch($(this).text())
            {
                case 'Incident':
                    $('span.custom-el-information-ticket-type').html(el_ticket_type_incident);
                    break;

                case 'Aanvraag':
                    $('span.custom-el-information-ticket-type').html(el_ticket_type_request);
                    break;
            }
        }
    });


    // CUSTOM ELEMENTS: LEFT
    el_information_content = '';


    // CUSTOM ELEMENTS: RIGHT
    el_information_content = '';
    el_information_check = false;

    if(GM_config.get('custom_elements_title') == true)
    {
        // CUSTOM ELEMENT: TITLE
        if(window_width > window_width_limit)
        {
            el_information_content += '<div class="accordion-item custom-el-information custom-el-information-title custom-element sticky-sm-top"><div class="accordion-body row m-0 mt-n2 pb-0">';
        }
        else
        {
            el_information_content += '<div class="accordion-item custom-el-information custom-el-information-title custom-element"><div class="accordion-body row m-0 mt-n2 pb-0">';
        }

        // status+title
        el_information_content += '<div class="form-field col-sm-8 mb-2"><label class="col-form-label">Ticket <span class="custom-el-information-ticket-type ms-2">'+el_ticket_type+'</span> <span class="custom-el-information-ticket-tasks ms-2"></span></label><div class="field-container">';
        el_information_content += '<h3>'+$('div.navigationheader h3.navigationheader-title').html()+'</h3>';
        el_information_content += '</div></div>';

        // list navigation
        el_information_content += '<div class="form-field col-sm-4 mb-2"><label class="col-form-label">Ticketlist</label><div class="field-container">';
        el_information_content += $('div.navigationheader div:first-of-type').html();
        el_information_content += $('div.navigationheader div:last-of-type').html();
        el_information_content += '</div></div>';

        el_information_content += '</div></div>';
    }

    if(GM_config.get('custom_elements_users') == true)
    {
        // CUSTOM ELEMENT: USERS: creation - update - followup
        el_information_content += '<div class="accordion-item custom-el-information custom-el-information-users custom-element"><div class="accordion-body row m-0 pb-0">';

        // creation
        el_information_content += '<div class="form-field col-sm-4 mb-2"><label class="col-form-label">Creation</label><div class="field-container">';
        if($('div.itil-left-side div.ITILContent div.creator span.badge span[data-hasqtip] a').length)
        {
            el_information_content += '<span class="glpi-badge"><i class="ti ti-user ms-1""></i> '+$('div.itil-left-side div.ITILContent div.creator span.badge span[data-hasqtip] a').attr('title')+'</span> ';
            el_information_content += '<span class="glpi-badge"><i class="far fa-clock me-1"></i> '+$('div.itil-left-side div.ITILContent div.creator span.badge span[data-bs-toggle]').attr('data-bs-original-title')+'</span>';
        }
        else if($('div.itil-left-side div.ITILContent div.creator span.badge span[data-hasqtip]').length)
        {
            el_information_content += '<span class="glpi-badge">'+$('div.itil-left-side div.ITILContent div.creator span.badge span[data-hasqtip]').html()+'</span> ';
            el_information_content += '<span class="glpi-badge"><i class="far fa-clock me-1"></i> '+$('div.itil-left-side div.ITILContent div.creator span.badge span[data-bs-toggle]').attr('data-bs-original-title')+'</span>';
        }
        el_information_content += '</div></div>';

        // update
        el_information_content += '<div class="form-field col-sm-4 mb-2"><label class="col-form-label">Last update</label><div class="field-container">';
        if($('div.itil-left-side div.ITILContent div.creator span.badge.ms-1 span[data-hasqtip] a').length)
        {
            el_information_content += '<span class="glpi-badge"><i class="ti ti-user ms-1""></i> '+$('div.itil-left-side div.ITILContent div.creator span.badge.ms-1 span[data-hasqtip] a').attr('title')+'</span> ';
            el_information_content += '<span class="glpi-badge"><i class="far fa-clock me-1"></i> '+$('div.itil-left-side div.ITILContent div.creator span.badge.ms-1 span[data-bs-toggle]').attr('data-bs-original-title')+'</span>';
        }
        else if($('div.itil-left-side div.ITILContent div.creator span.badge.ms-1 span[data-hasqtip]').length)
        {
            el_information_content += '<span class="glpi-badge">'+$('div.itil-left-side div.ITILContent div.creator span.badge.ms-1 span[data-hasqtip]').html()+'</span> ';
            el_information_content += '<span class="glpi-badge"><i class="far fa-clock me-1"></i> '+$('div.itil-left-side div.ITILContent div.creator span.badge.ms-1 span[data-bs-toggle]').attr('data-bs-original-title')+'</span>';
        }
        el_information_content += '</div></div>';

        // followup
        el_information_content += '<div class="form-field col-sm-4 mb-2"><label class="col-form-label">Last followup</label><div class="field-container">';
        if($('div.itil-left-side div.ITILFollowup div.creator span.badge span[data-hasqtip] a').length)
        {
            el_information_content += '<span class="glpi-badge"><i class="ti ti-user ms-1""></i> '+$('div.itil-left-side div.ITILFollowup div.creator span.badge span[data-hasqtip] a').attr('title')+'</span> ';
            el_information_content += '<span class="glpi-badge"><i class="far fa-clock me-1"></i> '+$('div.itil-left-side div.ITILFollowup div.creator span.badge span[data-bs-toggle]').attr('data-bs-original-title')+'</span>';
        }
        else if($('div.itil-left-side div.ITILFollowup div.creator span.badge span[data-hasqtip]').length)
        {
            el_information_content += '<span class="glpi-badge">'+$('div.itil-left-side div.ITILFollowup div.creator span.badge span[data-hasqtip]').html()+'</span> ';
            el_information_content += '<span class="glpi-badge"><i class="far fa-clock me-1"></i> '+$('div.itil-left-side div.ITILFollowup div.creator span.badge span[data-bs-toggle]').attr('data-bs-original-title')+'</span>';
        }
        el_information_content += '</div></div>';

        el_information_content += '</div></div>';


        // CUSTOM ELEMENT: SUPPORT: aanvrager - observer - toegekend aan - external ticket
        el_information_content += '<div class="accordion-item custom-el-information custom-el-information-support custom-element"><div class="accordion-body row m-0 mt-n2 pb-0">';

        // external ticket
        var external_ticket_id = '';
        var external_ticket_url = '';
        var external_ticket_supplier = '';

        var external_ticket_string = '';

/*
            if($('input[name="externalticketfield"]').length && $('input[name="externalticketfield"]').attr('value') != '')
            {
                var external_url = $('input[name="externalticketfield"]').attr('value');
                if(external_url.indexOf('href') == -1)
                {
                    external_url = '<a href="'+external_url+'" target="_blank">'+external_url+'</a>';
                }
                $('input[name="externalticketfield"]').after('<span class="form-control-plaintext"><span>'+external_url+'</span></span>');
                $('input[name="externalticketfield"]').hide();
            }
*/
        if($('input[name="externalticketfield"]').length && $('input[name="externalticketfield"]').attr('value') != '')
        {
            external_ticket_url = $('input[name="externalticketfield"]').attr('value');

            // url
            if(external_ticket_url.indexOf('href') != -1)
            {
                external_ticket_url = external_ticket_url.substring(external_ticket_url.indexOf('>')+1, external_ticket_url.lastIndexOf('<'));
            }

            // id
            external_ticket_id = external_ticket_url.substring(external_ticket_url.lastIndexOf('/')+1);

            // supplier
            if(external_ticket_url.indexOf('tein') != -1)
            {
                external_ticket_supplier = 'Tein';
                external_ticket_supplier_avatar = external_ticket_supplier_avatar_tein;
            }
            else if(external_ticket_url.indexOf('digipolis') != -1)
            {
                external_ticket_supplier = 'Digipolis';
                external_ticket_supplier_avatar = external_ticket_supplier_avatar_digipolis;
            }
            else
            {
                external_ticket_supplier = 'Andere';
            }

            external_ticket_string = '<span class="glpi-badge mt-1 external-link"><i class="ti fa-fw ti-external-link mx-1"></i>'+external_ticket_supplier+'&nbsp;<a href="'+external_ticket_url+'">'+external_ticket_id+'</a></span>';
        }


        var username;
        var usericon;

        var username_mail = ['Efoy Cloud','Icinga LTSU','InControl Peplink','Logitech Sync','PRTG02-TEIN'];
        var usericon_mail = 'ti fa-fw ti-mail mx-1';

        // aanvrager
        el_information_content += '<div class="form-field col-sm-4 mb-2"><label class="col-form-label">Aanvrager</label> <span class="custom-support-button custom-support-requester-add"></span><div class="field-container">';
        $('div#actors div.accordion-body div.form-field:eq(0) ul.select2-selection__rendered li.select2-selection__choice').each(function(){
            username = $(this).find('span.actor_text').text();
            usericon = $(this).find('i.ti').attr('class');
            if(username.toLowerCase().indexOf('pz.antwerpen.') >= 0)
            {
                username = username.replace(/pz.antwerpen./ig, '');
                usericon = usericon_mail;
            }
            if($.inArray(username, username_mail) > -1)
            {
                usericon = usericon_mail;
            }
            el_information_content += '<span class="glpi-badge mt-1 me-1"><i class="'+usericon+'"></i> '+username+'</span>';
            if($('div#actors div.accordion-body div.form-field:eq(0) ul.select2-selection__rendered li.select2-selection__choice').length < 5)
            {
                el_information_content += '<br> ';
            }
        });
        el_information_content += '</div></div>';

        // observer
        el_information_content += '<div class="form-field col-sm-4 mb-2"><label class="col-form-label">Observer</label>  <span class="custom-support-button custom-support-observer-add"></span><div class="field-container">';
        $('div#actors div.accordion-body div.form-field:eq(1) ul.select2-selection__rendered li.select2-selection__choice').each(function(){
            username = $(this).find('span.actor_text').text();
            usericon = $(this).find('i.ti').attr('class');
            if(username.toLowerCase().indexOf('pz.antwerpen.') >= 0)
            {
                username = username.replace(/pz.antwerpen./ig, '');
                usericon = usericon_mail;
            }
            if($.inArray(username, username_mail) > -1)
            {
                usericon = usericon_mail;
            }
            el_information_content += '<span class="glpi-badge mt-1 me-1"><i class="'+usericon+'"></i> '+username+'</span>';
            if($('div#actors div.accordion-body div.form-field:eq(1) ul.select2-selection__rendered li.select2-selection__choice').length < 5)
            {
                el_information_content += '<br> ';
            }
        });
        el_information_content += '</div></div>';

        // toegekend aan
        el_information_content += '<div class="form-field col-sm-4 mb-2"><label class="col-form-label">Toegekend aan</label>  <span class="custom-support-button custom-support-assign-add"></span><div class="field-container">';

        $('div#actors div.accordion-body div.form-field:eq(2) ul.select2-selection__rendered li.select2-selection__choice').each(function(){
            el_information_content += '<span class="glpi-badge mt-1 me-1"><i class="'+$(this).find('i.ti').attr('class')+'"></i> '+$(this).find('span.actor_text').text()+'</span>';
            if($('div#actors div.accordion-body div.form-field:eq(2) ul.select2-selection__rendered li.select2-selection__choice').length < 5)
            {
                el_information_content += '<br> ';
            }
        });
        if(external_ticket_string.length)
        {
            el_information_content += external_ticket_string;
        }
        el_information_content += '</div></div>';

        el_information_content += '</div></div>';

        el_information_check = true;
    }

    if(GM_config.get('custom_elements_opening') == true)
    {
        // CUSTOM ELEMENT: TICKET OPENING POST
        el_information_content += '<div class="accordion-item custom-el-information custom-el-opening custom-element"><div class="timeline-item ITILContent">';

        el_information_content += $('div.itil-left-side div.ITILContent').clone().html();

        el_information_content += '</div></div>';

        el_information_check = true;
    }

    if(GM_config.get('custom_elements_linked') == true)
    {
        // CUSTOM ELEMENT: LINKED TICKETS & ITEMS
        el_information_content += '<div class="accordion-item custom-el-information custom-el-information-tickets custom-element"><div class="accordion-body row m-0 pb-0">';

        // tickets
        el_information_content += '<div class="form-field col-sm-8 mb-2"><label class="col-form-label">Tickets</label><div class="field-container">';
        if($('div#linked_tickets div.list-group').length)
        {
            var link;
            $('div#linked_tickets div.list-group div.list-group-item').each(function(){
                link = $(this).find('div.text-truncate').html();
                link = link.replace(/col-9/gi,'').replace(/text-nowrap/gi,'');

                el_information_content += '<span class="glpi-badge mt-1">'+link+'</span><br> ';
            });
        }
        el_information_content += '</div></div>';

        // items
        el_information_content += '<div class="form-field col-sm-4 mb-2"><label class="col-form-label">Items</label><div class="field-container">';
        if($('div#items input[name="items_id"').length == 0)
        {
            $('div#items div div div').not(".input-group").not(".tooltip-invisible").each(function(){
                var items_lines;
                var item_string;
                var item_name;
                var item_link;
                var item_badge_nnn;

                if($(this).find('a:not(.btn)').length)
                {
                    // item with link
                    item_name = $(this).find('a:not(.btn)').attr('title');
                    item_link = $(this).find('a:not(.btn)').attr('href');

                    // NNN
                    if(item_link.indexOf("peripheral.form.php?id=10982") >= 1)
                    {
                        item_name = 'NNN';
                        item_badge_nnn = 'glpi-badge-nnn';
                    }

                    el_information_content += '<span class="glpi-badge '+item_badge_nnn+' mt-1"><a href="'+item_link+'"><i class="fas fa-fw fa-info mx-1"></i> '+item_name+'</a></span> ';
                }
                else
                {
                    // item without link
                    items_lines = $(this).html().split("-");
                    item_string = items_lines[0];
                    item_name = item_string.substring(item_string.indexOf(":") + 1, item_string.lastIndexOf("("));

                    el_information_content += '<span class="glpi-badge mt-1">'+item_name.trim()+'</span> ';
                }
            });
            if($('div#items div div input[type="hidden"][name*="items_id"]').length && $('div#items div div a[href*="/front/ticket.form.php"]').length)
            {
                el_information_content += '<span class="glpi-badge mt-1"><a href="'+$('div#items div div a[href*="/front/ticket.form.php"]').attr('href')+'"><i class="fas fa-fw fa-plus mx-1"></i> Meer... ('+$('div#items div div input[type="hidden"][name*="items_id"]').length+')</a></span> ';
            }
        }
        el_information_content += '</div></div>';

        el_information_content += '</div></div>';

        el_information_check = true;
    }

    if(el_information_check)
    {
        el_information_content += '<div class="accordion-item custom-el-information custom-el-information-hidden custom-element"><h2 class="accordion-header">';
        el_information_content += '<button class="accordion-button collapsed" type="button"><i class="ti ti-alert-circle me-1"></i><span class="item-title">GLPI Plus informatie</span></button>';
        el_information_content += '</h2></div>';
    }


    // CUSTOM ELEMENTS: add to page
    // only add the information once
    if($('div.itil-right-side div.accordion-flush div.accordion-item.custom-el-information').length == 0)
    {
        $('div.itil-right-side div.accordion-flush').prepend(el_information_content);
    }

    // support buttons
    if($('button[form*=addme_as_requester_]').length)
    {
        $('span.custom-support-button.custom-support-requester-add').html($('button[form*=addme_as_requester_]').clone(true).removeClass('float-end mt-1'));
    }
    if($('button[form*=addme_as_observer_]').length)
    {
        $('span.custom-support-button.custom-support-observer-add').html($('button[form*=addme_as_observer_]').clone(true).removeClass('float-end mt-1'));
    }
    if($('button[form*=addme_as_assign_]').length)
    {
        $('span.custom-support-button.custom-support-assign-add').html($('button[form*=addme_as_assign_]').clone(true).removeClass('float-end mt-1'));
    }


    // CUSTOM ELEMENTS: edit button opening post
    if(GM_config.get('custom_elements_opening') == true)
    {

        $('div.itil-left-side div.ITILContent').attr('id','el-openingpost');

        // replace button
        $('div.itil-right-side div.custom-el-opening div.ITILContent button.timeline-more-actions').remove();
        $('div.itil-right-side div.custom-el-opening div.ITILContent div.timeline-item-buttons').append('<button class="btn btn-sm btn-ghost-secondary timeline-more-actions show"><i class="fas ti ti-dots-vertical"></i></button>')

        // jump to opening post
        $('div.itil-right-side div.custom-el-opening div.ITILContent button.timeline-more-actions').on('click',function(e){
            e.preventDefault();
            e.stopPropagation();

            $("#el-openingpost").get(0).scrollIntoView({behavior: 'smooth'});
            $('div.itil-left-side div.ITILContent button.timeline-more-actions').click();
        });
    }


    if(GM_config.get('custom_elements_users') == true)
    {
        // GROEP
        var group_regex;

        // shorten the text
        $.each(groups_short, function(group_short, group_long){
            group_regex = new RegExp(group_long, 'gi');

            $(".custom-el-information-support").html($(".custom-el-information-support").html().replace(group_regex,group_short));
        });

        // re-replace 'helpdesk' > 'HD' > 'helpdesk' in URL's
        $(".custom-el-information-support").html($(".custom-el-information-support").html().replace(/\/HD\//g,'/helpdesk/'));

        // remove ids
        $(".custom-el-information-support").html($(".custom-el-information-support").html().replace(/\(\d+\)/gi,''));
    }


    // SHOW/HIDE CUSTOM ELEMENT

    if(window_width > window_width_limit)
    {
        // only show custom elements when the right side is expanded
        $('div#itil-object-container div.custom-element').css('display', 'none');
        $('div#itil-object-container.right-expanded div.custom-element').css('display', 'block');

        $('div#itil-object-container div.custom-el-information-hidden.custom-element').css('display', 'block');
        $('div#itil-object-container.right-expanded div.custom-el-information-hidden.custom-element').css('display', 'none');
    }
    else
    {
        // custom elements are shown
        // hide hidden information element
        $('div#itil-object-container div.custom-el-information-hidden.custom-element').css('display', 'none');
    }

    if(window_width > window_width_limit)
    {
        // adjust content height (default: ticket title on top of page)
        editTicketSingleCSS(true);
    }

    if(window_width > window_width_limit)
    {
        // hide navigation header when the right side is expanded (and custom title is shown)
        if($('div#itil-object-container').hasClass('right-expanded'))
        {
            if(GM_config.get('custom_elements_title') == true)
            {
                $('div.navigationheader').hide();

                // adjust content height (custom: ticket title in custom element and right panel expanded)
                editTicketSingleCSS(false);
            }
        }
    }
    else
    {
        // hide navigation header when custom title is shown
        if(GM_config.get('custom_elements_title') == true)
        {
            $('div.navigationheader').hide();
        }
    }

    if(window_width > window_width_limit)
    {
        // only show custom elements when the right side is expanded (after click on buttons)
        // only show navigation header when the right side is collapsed (after click on buttons)
        $('button.switch-panel-width').on('click', function() {
            // correct class is only added after the click, so the 'check' values seem to be incorrect
            if($('div#itil-object-container').hasClass('right-expanded') || $('div#itil-object-container').hasClass('right-collapsed'))
            {
                // PANEL: large>medium
                // PANEL: small>medium

                // hide custom elements
                $('div#itil-object-container div.custom-element').css('display', 'none');

                if(GM_config.get('custom_elements_title') == true)
                {
                    $('div.navigationheader').show();
                }

                editTicketSingleCSS(true);

                if(el_information_check)
                {
                    $('div.custom-el-information-hidden').show();
                }
            }
            else
            {
                // PANEL: medium>large

                // show custom elements
                $('div#itil-object-container div.custom-element').css('display', 'block');

                if(GM_config.get('custom_elements_title') == true)
                {
                    $('div.navigationheader').hide();

                    editTicketSingleCSS(false);
                }
                else
                {
                    editTicketSingleCSS(true);
                }

                if(el_information_check)
                {
                    $('div.custom-el-information-hidden').hide();
                }
            }
        });
        $('button.collapse-panel').on('click', function() {
            // PANEL: medium>small

            // hide custom elements
            $('div#itil-object-container div.custom-element').css('display', 'none');

            if(GM_config.get('custom_elements_title') == true)
            {
                $('div.navigationheader').show();
            }

            editTicketSingleCSS(true);
        });

        // make panel large when clicked on message
        $('div.custom-el-information-hidden button').on('click', function() {
            $('div.form-buttons button.switch-panel-width').click();
        });
    }


    // TICKET INFO: EXTERNAL TICKET

    // show external url as link
    if($('input[name="externalticketfield"]').length && $('input[name="externalticketfield"]').attr('value') != '')
    {
        var external_url = $('input[name="externalticketfield"]').attr('value');
        if(external_url.indexOf('href') == -1)
        {
            external_url = '<a href="'+external_url+'" target="_blank">'+external_url+'</a>';
        }
        $('input[name="externalticketfield"]').after('<span class="form-control-plaintext"><span>'+external_url+'</span></span>');
        $('input[name="externalticketfield"]').hide();
    }

    // TICKET INFO: TICKET TYPE
    if(el_ticket_type_id > 0)
    {
        $('h2#heading-main-item button').append('<span class="custom-el-information-ticket-type ms-2">'+el_ticket_type+'</span>');
        $('h2#items-heading button').append('<span class="custom-el-information-ticket-type ms-2">'+el_ticket_type+'</span>');
    }


    // TICKET INFO: ITEMS

    // on load
    editTicketSingleItemList();

    // on change
    var observer_items = new MutationObserver(function(e) {
        editTicketSingleItemList();
    });
    observer_items.observe($('div#itil-data div#items div.accordion-body')[0], {childList: true, subtree: false});


    // TICKET INFO: TASKS

    // add placeholder voor tasks
    $('h2#heading-main-item button').append('<span class="custom-el-information-ticket-tasks ms-2"></span>');


    // FOLLOWUP

    // add followup names
    var followup_type_public = 'Openbaar antwoord';
    var followup_type_private = 'Privé antwoord';

    var followup_name_followup_public = '<i class="ti ti-message-circle"></i> Openbaar antwoord toevoegen';
    var followup_name_followup_private = '<i class="ti ti-message-circle"></i> Privé antwoord toevoegen';
    var followup_name_task = '<i class="ti ti-checkbox"></i> Taak toevoegen';
    var followup_name_solution = '<i class="ti ti-check"></i> Oplossing toevoegen';

    $('div#new-ITILFollowup-block input[type="checkbox"][name="is_private"]').parent().append('<span class="followup-type">'+followup_type_public+'</span>');

    $('div#new-ITILFollowup-block div.clearfix').prepend('<span class="followup-name">'+followup_name_followup_public+'</span>');
    $('div#new-TicketTask-block div.clearfix').prepend('<span class="followup-name">'+followup_name_task+'</span>');
    $('div#new-ITILSolution-block div.clearfix').prepend('<span class="followup-name">'+followup_name_solution+'</span>');

    // change background-color of followup
    if($('div#new-ITILFollowup-block input[type="checkbox"][name="is_private"]').is(":checked"))
    {
        $('div#new-ITILFollowup-block span.followup-type').html(followup_type_private);

        $('div#new-ITILFollowup-block .timeline-content').addClass('h_content_private');
        $('div#new-ITILFollowup-block div.clearfix span.followup-name').html(followup_name_followup_private);
    }
    $('div#new-ITILFollowup-block input[type="checkbox"][name="is_private"]').on('change', function(e){
        if($('div#new-ITILFollowup-block input[type="checkbox"][name="is_private"]').is(":checked"))
        {
            $('div#new-ITILFollowup-block span.followup-type').html(followup_type_private);

            $('div#new-ITILFollowup-block .timeline-content').addClass('h_content_private');
            $('div#new-ITILFollowup-block div.clearfix span.followup-name').html(followup_name_followup_private);
        }
        else
        {
            $('div#new-ITILFollowup-block span.followup-type').html(followup_type_public);

            $('div#new-ITILFollowup-block .timeline-content').removeClass('h_content_private');
            $('div#new-ITILFollowup-block div.clearfix span.followup-name').html(followup_name_followup_public);
        }
    });

    // change markup of task
    editTicketSingleTasks();

    var observer_tasks = new MutationObserver(function(e) {

        if($(e[0].target).attr('class').indexOf('state_2') > 0)
        {
            $(e[0].target).parents('div.ITILTask').removeClass('todo').addClass('done');
        }
        else if($(e[0].target).attr('class').indexOf('state_1') > 0)
        {
            $(e[0].target).parents('div.ITILTask').removeClass('done').addClass('todo');
        }

        editTicketSingleTasks();
    });
    $('div.ITILTask div.todo-list-state span.state').each(function(){
        observer_tasks.observe($(this)[0], {childList: false, attributes: true, attributeFilter: ['class'], attributeOldValue: true});
    });



    // change status of followup/task
    var followup_state_busy = '<span class="glpi-badge bg-transparent me-1">Nieuwe status:</span> <span class="glpi-badge itilstatus"><i class="itilstatus assigned far fa-circle me-1"></i> Bezig met verwerken</span>';
    var followup_state_wait = '<span class="glpi-badge bg-transparent me-1">Nieuwe status:</span> <span class="glpi-badge itilstatus"><i class="itilstatus waiting fas fa-circle me-1"></i> Wachten</span>';

    $('div#new-ITILFollowup-block div.card-footer div.input-group').append('<span class="input-group-text bg-yellow-lt custom-state">'+followup_state_busy+'</span>');

    if($('div#new-ITILFollowup-block div.card-footer input[type="checkbox"][name="pending"]').is(":checked"))
    {
        $('div#new-ITILFollowup-block div.card-footer div.input-group span.input-group-text.custom-state').html(followup_state_wait);
    }
    $('div#new-ITILFollowup-block div.card-footer input[type="checkbox"][name="pending"]').on('change', function(e){
        if($('div#new-ITILFollowup-block div.card-footer input[type="checkbox"][name="pending"]').is(":checked"))
        {
            $('div#new-ITILFollowup-block div.card-footer div.input-group span.input-group-text.custom-state').html(followup_state_wait);
        }
        else
        {
            $('div#new-ITILFollowup-block div.card-footer div.input-group span.input-group-text.custom-state').html(followup_state_busy);
        }
    });

    $('div#new-TicketTask-block div.card-footer div.input-group').append('<span class="input-group-text bg-yellow-lt custom-state">'+followup_state_busy+'</span>');

    if($('div#new-TicketTask-block div.card-footer input[type="checkbox"][name="pending"]').is(":checked"))
    {
        $('div#new-TicketTask-block div.card-footer div.input-group span.input-group-text.custom-state').html(followup_state_wait);
    }
    $('div#new-TicketTask-block div.card-footer input[type="checkbox"][name="pending"]').on('change', function(e){
        if($('div#new-TicketTask-block div.card-footer input[type="checkbox"][name="pending"]').is(":checked"))
        {
            $('div#new-TicketTask-block div.card-footer div.input-group span.input-group-text.custom-state').html(followup_state_wait);
        }
        else
        {
            $('div#new-TicketTask-block div.card-footer div.input-group span.input-group-text.custom-state').html(followup_state_busy);
        }
    });

    // show state of solution
    var solution_state = '<span class="glpi-badge bg-transparent me-1">Nieuwe status:</span> <span class="glpi-badge itilstatus"><i class="itilstatus solved far fa-circle me-1"></i> Opgelost</span>';

    $('div#new-ITILSolution-block div.card-footer').append('<span class="input-group-text bg-yellow-lt custom-state">'+solution_state+'</span>');
    $('div#new-ITILSolution-block div.card-footer').wrapInner('<span class="input-group"></span>');
    $('div#new-ITILSolution-block div.card-footer .btn.btn-primary').removeClass('me-2');


    // copy content of followup/solution to clipboard when clicked on add button
    $('div.itilfollowup button[name="add"]').on('click', function(e){
        var $temp = $("<textarea>");
        $(this).parent().append($temp);
        $temp.val($('div.itilfollowup iframe').contents().find('#tinymce').prop("innerText")).select();
        document.execCommand("copy");
        $temp.remove();
    });
    $('div.itilsolution button[name="add"]').on('click', function(e){
        var $temp = $("<textarea>");
        $(this).parent().append($temp);
        $temp.val($('div.itilsolution iframe').contents().find('#tinymce').prop("innerText")).select();
        document.execCommand("copy");
        $temp.remove();
    });


    // GLOBAL

    // add the timestamps to followups
    $('div.timeline-item div.timeline-content div.creator span.badge span').each(function(){
        if($(this).attr('data-bs-toggle') == 'tooltip')
        {
            $(this).parent().prepend($(this).attr('data-bs-original-title')+' |');
        }
    });

    // remove clutter css styles from opening post and followups
    //$('div.ITILContent  div.rich_text_container div:not(.long_text)').css('color','').css('font','').css('font-family','').css('font-size','').css('background','').css('background-color','');
    //$('div.ITILFollowup div.rich_text_container div:not(.long_text)').css('color','').css('font','').css('font-family','').css('font-size','').css('background','').css('background-color','');
    //$('div.ITILContent  div.rich_text_container div:not(.long_text) *').not('.long_text').not('a[href*="/front/user.form.php"] span').css('color','').css('font','').css('font-family','').css('font-size','').css('background','').css('background-color','');
    //$('div.ITILFollowup div.rich_text_container div:not(.long_text) *').not('.long_text').not('a[href*="/front/user.form.php"] span').css('color','').css('font','').css('font-family','').css('font-size','').css('background','').css('background-color','');

    // remove clutter css styles from opening post and followups
    //$('div.ITILContent  div.rich_text_container div').css('color','').css('font','').css('font-family','').css('font-size','').css('background','').css('background-color','');
    //$('div.ITILFollowup div.rich_text_container div').css('color','').css('font','').css('font-family','').css('font-size','').css('background','').css('background-color','');
    //$('div.ITILContent  div.rich_text_container div *').not('a[href*="/front/user.form.php"] span').css('color','').css('font','').css('font-family','').css('font-size','').css('background','').css('background-color','');
    //$('div.ITILFollowup div.rich_text_container div *').not('a[href*="/front/user.form.php"] span').css('color','').css('font','').css('font-family','').css('font-size','').css('background','').css('background-color','');

    // remove clutter css styles from opening post and followups
    $('div.ITILContent  div.rich_text_container div').css('color','').css('font','').css('font-family','').css('font-size','').css('background','').css('background-color','');
    $('div.ITILFollowup div.rich_text_container div').css('color','').css('font','').css('font-family','').css('font-size','').css('background','').css('background-color','');
    $('div.ITILContent  div.rich_text_container div *').not('a[href*="/front/user.form.php"] span').not('span').css('color','').css('font','').css('font-family','').css('font-size','').css('background','').css('background-color','');
    $('div.ITILFollowup div.rich_text_container div *').not('a[href*="/front/user.form.php"] span').not('span').css('color','').css('font','').css('font-family','').css('font-size','').css('background','').css('background-color','');
    $('div.ITILContent  div.rich_text_container div').find('span').css('font','').css('font-family','').css('font-size','');
    $('div.ITILFollowup div.rich_text_container div').find('span').css('font','').css('font-family','').css('font-size','');

    // remove text color not set in GLPI
    var glpi_text_colors = ['rgb(45, 194, 107)', 'rgb(241, 196, 15)', 'rgb(224, 62, 45)', 'rgb(185, 106, 217)', 'rgb(53, 152, 219)', 'rgb(22, 145, 121)', 'rgb(230, 126, 35)', 'rgb(186, 55, 42)', 'rgb(132, 63, 161)', 'rgb(35, 111, 161)'];
    $('div.ITILContent div.rich_text_container * span[style*="color"], div.ITILFollowup div.rich_text_container * span[style*="color"]').each(function(){
        if(glpi_text_colors.indexOf($(this).css('color')) === -1)
        {
            $(this).css('color', '');
        }
    });

    // change text color of marked text
    $('div.ITILContent div.rich_text_container * span[style*="background"], div.ITILFollowup div.rich_text_container * span[style*="background"]').each(function(){
        $(this).colourBrightness();
    });

    // MAIL WARNING messsages: change markup
    var messenger = '';

    // warning senders: ?
    $('div.ITILContent  table div:contains("often get email from")').parent().closest('table').css('font-size','75%').css('margin-bottom','20px').find('td[bgcolor="#EAEAEA"]').attr('bgcolor','#DADADA').css('background-color','#DADADA').css('color','#666666');
    $('div.ITILFollowup table div:contains("often get email from")').parent().closest('table').css('font-size','75%').css('margin-bottom','20px').find('td[bgcolor="#EAEAEA"]').attr('bgcolor','#DADADA').css('background-color','#DADADA').css('color','#666666');

    // warning senders: Peplink, 802
    $('div.ITILContent  table div:contains("U ontvangt niet vaak e-mail")').parent().closest('table').css('font-size','75%').css('margin-bottom','20px').find('td[bgcolor="#EAEAEA"]').attr('bgcolor','#DADADA').css('background-color','#DADADA').css('color','#666666');
    $('div.ITILFollowup table div:contains("U ontvangt niet vaak e-mail")').parent().closest('table').css('font-size','75%').css('margin-bottom','20px').find('td[bgcolor="#EAEAEA"]').attr('bgcolor','#DADADA').css('background-color','#DADADA').css('color','#666666');
    $('div.ITILContent  table div:contains("ontvangen niet vaak e-mail")').parent().closest('table').css('font-size','75%').css('margin-bottom','20px').find('td[bgcolor="#EAEAEA"]').attr('bgcolor','#DADADA').css('background-color','#DADADA').css('color','#666666');
    $('div.ITILFollowup table div:contains("ontvangen niet vaak e-mail")').parent().closest('table').css('font-size','75%').css('margin-bottom','20px').find('td[bgcolor="#EAEAEA"]').attr('bgcolor','#DADADA').css('background-color','#DADADA').css('color','#666666');

    // warning senders: N-Allo
    $('div.ITILFollowup span:contains("WAARSCHUWING: DIT IS EEN EXTERNE MAIL")')     .parent().closest('div').css('background-color','#DADADA').css('color','#666666').css('font-size','75%').css('margin-bottom','0px').css('padding','5px 10px');
    $('div.ITILFollowup span:contains("Deze mail komt van buiten onze organisatie")').parent().closest('div').css('background-color','#DADADA').css('color','#666666').css('font-size','75%').css('margin-bottom','20px').css('padding','5px 10px');

    // warning senders: other, no background color
    $('div.ITILContent  table p:contains("often get email from")').parent().closest('table').css('font-size','75%').css('margin-bottom','20px').find('td[bgcolor!="#DADADA"]').attr('bgcolor','#DADADA').css('background-color','#DADADA').css('color','#666666').find('p').css('margin-bottom','0px');
    $('div.ITILFollowup table p:contains("often get email from")').parent().closest('table').css('font-size','75%').css('margin-bottom','20px').find('td[bgcolor!="#DADADA"]').attr('bgcolor','#DADADA').css('background-color','#DADADA').css('color','#666666').find('p').css('margin-bottom','0px');
    $('div.ITILContent  table p:contains("U ontvangt niet vaak e-mail")').parent().closest('table').css('font-size','75%').css('margin-bottom','20px').find('td[bgcolor!="#DADADA"]').attr('bgcolor','#DADADA').css('background-color','#DADADA').css('color','#666666').find('p').css('margin-bottom','0px');
    $('div.ITILFollowup table p:contains("U ontvangt niet vaak e-mail")').parent().closest('table').css('font-size','75%').css('margin-bottom','20px').find('td[bgcolor!="#DADADA"]').attr('bgcolor','#DADADA').css('background-color','#DADADA').css('color','#666666').find('p').css('margin-bottom','0px');

    if(style_auror_dark || style_darker || style_midnight)
    {
        // warning senders: ?
        $('div.ITILContent  table div:contains("often get email from")').parent().closest('table').find('td[bgcolor="#DADADA"]').attr('bgcolor','#333333').css('background-color','#333333').css('color','#999999');
        $('div.ITILFollowup table div:contains("often get email from")').parent().closest('table').find('td[bgcolor="#DADADA"]').attr('bgcolor','#333333').css('background-color','#333333').css('color','#999999');

        // warning senders: Peplink, 802
        $('div.ITILContent  table div:contains("U ontvangt niet vaak e-mail")').parent().closest('table').find('td[bgcolor="#DADADA"]').attr('bgcolor','#333333').css('background-color','#333333').css('color','#999999');
        $('div.ITILFollowup table div:contains("U ontvangt niet vaak e-mail")').parent().closest('table').find('td[bgcolor="#DADADA"]').attr('bgcolor','#333333').css('background-color','#333333').css('color','#999999');
        $('div.ITILContent  table div:contains("ontvangen niet vaak e-mail")').parent().closest('table').find('td[bgcolor="#DADADA"]').attr('bgcolor','#333333').css('background-color','#333333').css('color','#999999');
        $('div.ITILFollowup table div:contains("ontvangen niet vaak e-mail")').parent().closest('table').find('td[bgcolor="#DADADA"]').attr('bgcolor','#333333').css('background-color','#333333').css('color','#999999');

        // warning senders: N-Allo
        $('div.ITILFollowup span:contains("WAARSCHUWING: DIT IS EEN EXTERNE MAIL")')     .parent().closest('div').css('background-color','#333333').css('color','#999999');
        $('div.ITILFollowup span:contains("Deze mail komt van buiten onze organisatie")').parent().closest('div').css('background-color','#333333').css('color','#999999');

        // warning senders: other, no background color
        $('div.ITILContent  table p:contains("often get email from")').parent().closest('table').find('td[bgcolor!="#333333"]').attr('bgcolor','#333333').css('background-color','#333333').css('color','#999999');
        $('div.ITILFollowup table p:contains("often get email from")').parent().closest('table').find('td[bgcolor!="#333333"]').attr('bgcolor','#333333').css('background-color','#333333').css('color','#999999');
        $('div.ITILContent  table p:contains("U ontvangt niet vaak e-mail")').parent().closest('table').find('td[bgcolor!="#333333"]').attr('bgcolor','#333333').css('background-color','#333333').css('color','#999999');
        $('div.ITILFollowup table p:contains("U ontvangt niet vaak e-mail")').parent().closest('table').find('td[bgcolor!="#333333"]').attr('bgcolor','#333333').css('background-color','#333333').css('color','#999999');
    }

    // GLPI TWEAKS messages: change markup
    $('div.ITILFollowup div.rich_text_container:contains("-- via de applicatie GLPI aanpassen entiteit")').parents('div.h_content_private').addClass('content_ticketsync');

    // TICKETSYNC messages: change markup
    $('div.ITILFollowup div.rich_text_container:contains("Nieuwe gekoppelde items")').parents('div.h_content_private').addClass('content_ticketsync');
    $('div.ITILFollowup div.rich_text_container:contains("[Status extern ticket")').parents('div.h_content_private').addClass('content_ticketsync');
    $('div.ITILFollowup div.rich_text_container:contains("[Sync geactiveerd")').parents('div.h_content_private').addClass('content_ticketsync');
    $('div.ITILFollowup div.rich_text_container:contains("[Sync gedeactiveerd")').parents('div.h_content_private').addClass('content_ticketsync');
    $('div.ITILFollowup div.rich_text_container:contains("Ticket opgelost op extern systeem")').parents('div.h_content_private').addClass('content_ticketsync');
    $('div.ITILFollowup div.rich_text_container:contains("Ticket gesloten op extern systeem")').parents('div.h_content_private').addClass('content_ticketsync');
    $('div.ITILFollowup div.rich_text_container:contains("Ticket opnieuw geopend op extern systeem")').parents('div.h_content_private').addClass('content_ticketsync');
    $('div.ITILFollowup div.rich_text_container:contains("SyncException")').parents('div.h_content_private').addClass('content_ticketsync');

    // TICKETSYNC messages: change markup
    messenger = 'Ticket Sync';

    $('div.timeline-item div.creator a:contains("'+messenger+'")').filter(function(){ return $(this).parent('h4').length == 0;}).each(function(){

        var followup = $(this).parents('div.card-body').eq(0).find('div.rich_text_container');
        var user_line = '';

        if(followup.find('p:contains("Agent: ")').length == 1)
        {
            user_line = followup.find('p:contains("Agent: ")').text();
        }
        if(followup.find('p:contains("Naam: ")').length == 1)
        {
            user_line = followup.find('p:contains("Naam: ")').text();
        }

        if(user_line.length)
        {
            $(this).parents('div.creator').eq(0).append('<span class="badge user-select-auto text-wrap text-end d-none d-md-block"><i class="ti fa-fw ti-package mx-1"></i>'+user_line+'</span>');
        }
    });


    // TICKETSYNC messages: change avatar(s)
    if(external_ticket_supplier_avatar != '')
    {
        // supplier
        $('div.itil-timeline div.creator>span:first-child a[title="Ticket Sync"]').each(function(){
            $(this).parents('div.row').eq(0).find('div a>span').attr('style','background-image: url('+external_ticket_supplier_avatar+'); background-color: inherit;');
        });

        // sub-supplier
        $('div.itil-timeline div.creator span.badge:contains("802")').each(function(){
            $(this).parents('div.row').eq(0).find('div a>span').attr('style','background-image: url('+external_ticket_supplier_avatar_802+'); background-color: inherit;').text('');
        });
        $('div.itil-timeline div.creator span.badge:contains("n-allo")').each(function(){
            $(this).parents('div.row').eq(0).find('div a>span').attr('style','background-image: url('+external_ticket_supplier_avatar_nallo+'); background-color: inherit;').text('');
        });

    }

    // LOGITECH SYNC messages: change info
    $('div.timeline-item table[width="100%"] p:contains("was disconnected")').each(function(){
        $(this).wrapInner('<span class="p-1 h-auto bg-warning status rounded-1"></span>').before('<p><span class="p-2 h-auto bg-warning status rounded-2">Device error</span></p>');
    });
    $('div.timeline-item table[width="100%"] p:contains("went offline")').each(function(){
        $(this).wrapInner('<span class="p-1 h-auto bg-danger status rounded-1"></span>').before('<p><span class="p-2 h-auto bg-danger status rounded-2">Room error</span></p>');
    });


    // PEPLINK messages: change info
    messenger = 'InControl Peplink';

    $('div.timeline-item div.creator a:contains("'+messenger+'")').filter(function(){ return $(this).parent('h4').length == 0;}).each(function(){

        var followup = $(this).parents('div.card-body').eq(0).find('div.rich_text_container');
        var information;

        if(followup.find('li:contains("online on")').length == 1)
        {
            followup.find('li:contains("online on")').parent().before('<p><span class="p-2 h-auto bg-success status rounded-2">Online alert</span></p>');

            // split information
            information = followup.find('li:contains("online on")');

            information.html(information.html().replace(' - <a','</li><li><a'));
            information.html(information.html().replace('online on','</li><li>online on'));
            information.html(information.html().replace(' , after','</li><li>after'));

            information.find('a').wrap('<span class="glpi-badge"></span>');
        }
        if(followup.find('li:contains("offline for")').length == 1)
        {
            followup.find('li:contains("offline for")').parent().before('<p><span class="p-2 h-auto bg-danger status rounded-2">Offline alert</span></p>');

            // split information
            information = followup.find('li:contains("offline for")');

            information.html(information.html().replace(' - <a','</li><li><a'));
            information.html(information.html().replace('offline for','</li><li>offline for'));
            information.html(information.html().replace('. Last','</li><li>Last'));

            information.find('a').wrap('<span class="glpi-badge"></span>');
        }

        if(followup.text().indexOf('geo-fence') >= 0)
        {
            // add paragraphs
            followup.wrapInner('<p></p>');
            followup.html(followup.html().replace(/<br>\\*/g,'</p><p>'));
            followup.html(followup.html().replace('<p></p>',''));

            if(followup.find('p:contains("Garage")').length > 0)
            {
                if(followup.find('p:contains("entered the geo-fence")').length == 1)
                {
                    followup.find('p:contains("entered the geo-fence")').before('<p><span class="p-2 h-auto bg-danger status rounded-2">Garage entered</span></p>');
                }
                if(followup.find('p:contains("left the geo-fence")').length == 1)
                {
                    followup.find('p:contains("left the geo-fence")').before('<p><span class="p-2 h-auto bg-success status rounded-2">Garage left</span></p>');
                }

                // split information
                information = followup.find('p:contains("Location")');
                information.replaceWith($('<ul><li>' + information.html() + '</li></ul>'));

                information = followup.find('li:contains("Location")');

                information.html(information.html().replace('entered the','</li><li>entered the'));
                information.html(information.html().replace('left the','</li><li>left the'));
                information.html(information.html().replace('geo-fence "','geo-fence <span class="glpi-badge">'));
                information.html(information.html().replace('" on','</span></li><li>on'));
                information.html(information.html().replace('Location','</li><li>Location'));

                information.find('a').wrap('<span class="glpi-badge"></span>');
            }
        }
    });

    // ICINGA messages: change info
    $('div.timeline-item table[width="640"] td:contains("PROBLEM")').each(function(){
        $(this).not($(this).has('td:contains("PROBLEM")')).wrapInner('<span class="p-2 h-auto bg-warning status rounded-2"></span>');
    });
    $('div.timeline-item table[width="640"] td:contains("DOWN")').each(function(){
        $(this).not($(this).has('td:contains("DOWN")')).wrapInner('<span class="p-2 h-auto bg-danger status rounded-2"></span>');
    });

    // EFOY messages: change markup
    $('div.timeline-item table[width="100%"] * td[bgcolor="#f4f4f4"]').css('background-color','rgba(0,0,0,0.15)').attr('bgcolor','');
    $('div.timeline-item table[width="100%"] * td[bgcolor="#f6f6f6"]').css('background-color','rgba(0,0,0,0.15)').attr('bgcolor','');
    // EFOY messages: change info
    $('div.timeline-item table[width="100%"] td:contains("Alert Notification")').each(function(){

        if($(this).not($(this).has('td:contains("Alert Notification")')).length == 1)
        {
            if($(this).parents('table').eq(2).has('td:contains("The device went offline")').length == 1)
            {
                $(this).wrapInner('<span class="p-2 h-auto bg-warning status rounded-2"></span>');
            }
            if($(this).parents('table').eq(2).has('td:contains("The device went online")').length == 1)
            {
                $(this).wrapInner('<span class="p-2 h-auto bg-blue status rounded-2"></span>');
            }
        }
    });
    $('div.timeline-item table[width="100%"] td:contains("Connection Lost")').each(function(){
        $(this).not($(this).has('td:contains("Connection Lost")')).wrapInner('<span class="p-2 h-auto bg-danger status rounded-2"></span>');
    });
    $('div.timeline-item table[width="100%"] td:contains("The device went offline")').each(function(){
        $(this).not($(this).has('td:contains("The device went offline")')).wrapInner('<span class="mt-1 p-2 h-auto bg-danger status rounded-2"></span>');
    });
    $('div.timeline-item table[width="100%"] td:contains("Connected")').each(function(){
        $(this).not($(this).has('td:contains("Connected")')).wrapInner('<span class="p-2 h-auto bg-success status rounded-2"></span>');
    });
    $('div.timeline-item table[width="100%"] td:contains("The device went online")').each(function(){
        $(this).not($(this).has('td:contains("The device went online.")')).wrapInner('<span class="mt-1 p-2 h-auto bg-success status rounded-2"></span>');
    });

    // PRTG messages: change markup
    $('div.timeline-item table[width="100%"] * [bgcolor="#fff"]').css('background-color','transparent').attr('bgcolor','');
    $('div.timeline-item table[width="100%"] * [bgcolor="#ffffff"]').css('background-color','transparent').attr('bgcolor','');
    $('div.timeline-item table[width="100%"] * [bgcolor="#eeeeee"]').css('background-color','transparent').attr('bgcolor','');
    $('div.timeline-item table[width="100%"] * table td').css('border-color','transparent');
    $('div.timeline-item table[width="100%"] * td[bgcolor="#d71920"]').css('color','#FFFFFF');
    $('div.timeline-item table[width="100%"] * td[bgcolor="#ffcb05"]').css('color','#000000');
    // PRTG messages: change info
    $('div.timeline-item table[width="600"]').each(function(){
        $(this).html($(this).html().replace(/&amp;gt;/gi,'>'));
        $(this).html($(this).html().replace(/&amp;#34;/gi,'"'));
        $(this).html($(this).html().replace(/&amp;#39;/gi,"'"));
        // remove PRTG images
        $(this).find('img[alt*="PRTG"]').remove();
        $(this).find('img[loading="lazy"]').remove();
    });

    // HISTORY messages: change markup
    var history;
    var history_parts;

    $('div.timeline-item.Log').each(function(){
        // change markup
        $(this).addClass('ITILFollowup');
        $(this).find('div.timeline-content').addClass('h_content_private content_ticketsync');

        // change avatar
        $(this).find('div.user-part span.avatar').html('<i class="fas fa-history me-1" title="" data-bs-toggle="tooltip" data-bs-original-title="Log entry" aria-label="Log entry"></i>');

        // get content
        history = $(this).find('div.read-only-content').html();

        // remove avatar from content
        history = history.replace(/<i.*?>.*?<\/i>/gi,'');

        history_parts = history.split(': ');

        // add badges
        if(history_parts.length == 2)
        {
            history = '<div class="timeline-badges"><span class="badge bg-blue-lt">'+history_parts[0]+'</span></div>';

            if(history_parts[1].indexOf('Wijzig') !== -1)
            {
                history += '<span class="glpi-badge tags_already_set mb-1 me-3"><span class="text-success"><i class="fas fa-check me-1"></i> '+history_parts[1].substring(history_parts[1].indexOf('<ins>')+'<ins>'.length,history_parts[1].indexOf('</ins>')).trim()+'</span></span>';
                history += '<span class="glpi-badge tags_already_set mb-1"><span class="text-danger"><i class="fas fa-trash me-1"></i> '+history_parts[1].substring(history_parts[1].indexOf('<del>')+'<del>'.length,history_parts[1].indexOf('</del>')).trim()+'</span></span>';
            }
            else
            {
                history += '<span class="glpi-badge tags_already_set"><span class="text-success"><i class="fas fa-check me-1"></i> '+history_parts[1]+'</span></span>';
            }
        }
        if(history_parts.length == 3)
        {
            history = '<div class="timeline-badges"><span class="badge bg-blue-lt">'+history_parts[0]+' | '+history_parts[1]+'</span></div>';

            if(history_parts[1].indexOf('Voeg') !== -1)
            {
                history += '<span class="glpi-badge tags_already_set"><span class="text-success"><i class="fas fa-check me-1"></i> '+history_parts[2]+'</span></span>';
            }
            else if(history_parts[1].indexOf('Verwijder') !== -1)
            {
                history += '<span class="glpi-badge tags_already_set"><span class="text-danger"><i class="fas fa-trash me-1"></i> '+history_parts[2]+'</span></span>';
            }
            else
            {
                history += '<span class="glpi-badge tags_already_set"><span class="">'+history_parts[2]+'</span></span>';
            }
        }

        // set content
        $(this).find('div.read-only-content').html(history);
    });

    // remove denied images
    $('div.timeline-item span.timeline-content img[src*="denied"]').remove();
}


// ***********************************************
// Edit single ticket: Taksks
// ***********************************************
function editTicketSingleTasks()
{
    var tasks_todo = 0;
    var tasks_done = 0;
    var tasks_color = '';
    var tasks_icon = 'far fa-check-circle';
    var tasks_string = '';

    // look for tasks
    $('div.timeline-item.ITILTask').each(function(){
        if($(this).hasClass('todo'))
        {
            tasks_todo++;
        }
        if($(this).hasClass('done'))
        {
            tasks_done++;
        }
    });

    // set markup
    if(tasks_todo + tasks_done > 0)
    {
        if(tasks_done == 0)
        {
            tasks_color = 'text-danger';
        }
        else if(tasks_todo == 0)
        {
            tasks_color = 'text-success';
            tasks_icon = 'fas fa-check-circle';
        }
        else
        {
            tasks_color = 'text-warning';
        }

        tasks_string = '<span class="glpi-badge"><span class="'+tasks_color+'"><i class="'+tasks_icon+' me-2"></i>Taken '+tasks_done+'/'+(tasks_todo + tasks_done)+'</span></span>';

        $('span.custom-el-information-ticket-tasks').html(tasks_string);
    }
    else
    {
        $('span.custom-el-information-ticket-tasks').html('');
    }
}


// ***********************************************
// Edit single ticket: Items List
// ***********************************************
function editTicketSingleItemList()
{
    // add class
    $('div#itil-data div#items div.accordion-body > div > div:not(.input-group)').addClass('list-group-item');

    // change markup of info/warning message
    var message = $('div#itil-data div#items div.accordion-body > div > i').html();

    if(message != null)
    {
        if(message.indexOf('href') >= 0)
        {
            // info (link)
            $('div#itil-data div#items div.accordion-body > div > i').wrap('<span class="glpi-badge mt-3 px-3 py-2 d-block bg-blue"></span>').addClass('text-white fst-normal fw-bold').html('<i class="fas fa-plus me-2"></i>'+message);
        }
        else
        {
            // warning
            $('div#itil-data div#items div.accordion-body > div > i').wrap('<span class="glpi-badge mt-3 px-3 py-2 d-block bg-warning"></span>').addClass('text-white fst-normal fw-bold').html('<i class="fas fa-exclamation-triangle me-2"></i>'+message);
        }
    }

    // change markup of items
    $('div#items div.list-group-item').each(function(){
        var item_title_text;
        var item_title_text_span;
        var item_link_text;
        var item_link_text_span;
        var item_link;

        if($(this).find('a').length > 0)
        {
            item_title_text = $(this).find('a')[0].previousSibling;
            $(item_title_text).wrap('<span class="list-group-item-title"></span>');

            item_title_text_span = $(this).find('span.list-group-item-title');
            if($(item_title_text_span).text().substring($(item_title_text_span).text().length - 3, $(item_title_text_span).text().length) == " : ")
            {
                $(item_title_text_span).text($(item_title_text_span).text().substring(0,$(item_title_text_span).text().length - 3));
            }


            item_link_text = $(this).find('a').find('span.fas.fa-info')[0].previousSibling;
            $(item_link_text).wrap('<span class="list-group-item-link"></span>');

            item_link_text_span = $(this).find('span.list-group-item-link');
            if($(item_link_text_span).text().substring($(item_link_text_span).text().length - 3, $(item_link_text_span).text().length) == " - ")
            {
                $(item_link_text_span).text($(item_link_text_span).text().substring(0,$(item_link_text_span).text().length - 3));
            }


            if($(this).find('a').attr('href').indexOf('peripheral.form.php?id=10982') >= 1)
            {
                $(this).addClass('list-group-item-nnn');
            }

            $(this).find('a').wrap('<span class="glpi-badge"></span>');
        }
        else if($(this).find('span.fas.fa-info').length > 0)
        {
            // split text
            var item_text = $(this).find('span.fas.fa-info')[0].previousSibling;


            if($(item_text).text().indexOf(" : ") > 0 && $(item_text).text().indexOf(" - ") > 0)
            {
                var item_array = $(item_text).text().match(/(.+)(:)(.+)(-)(.+)/);

                item_title_text = '<span class="list-group-item-title">'+item_array[1].trim()+'</span>';
                item_link_text = '<span class="list-group-item-link"><span class="glpi-badge">'+item_array[3].trim()+'</span></span>';

                $(this).find('span.fas.fa-info')[0].previousSibling.nodeValue = "";
                $(this).prepend(item_link_text).prepend(item_title_text);
            }
        }
    });
}


// ***********************************************
// Edit single ticket: Items Overview
// ***********************************************
function editTicketSingleItemOverview()
{
    // CHANGE TABLE LAYOUT of tab_cadre_fixe
    var thead_rows;

    // move table headers to thead
    if($('table.tab_cadre_fixehov thead').length == 0)
    {
        thead_rows = $('table.tab_cadre_fixehov').find("tr:has(th)");

        $('table.tab_cadre_fixehov').prepend('<thead></thead>');
        $('table.tab_cadre_fixehov thead').append(thead_rows.clone(true));

        thead_rows.remove();
        $('table.tab_cadre_fixehov thead tr:not(:first-child)').remove();
    }

    // change layout
    $('table.tab_cadre_fixehov').removeClass('tab_cadre_fixehov').addClass('table table-borderless table-striped table-hover card-table');


    // PROCESS SINGLE (unprocessed) TABLE
    $('table.card-table:not(.plus-processed)').each(function(){

        // GLOBAL
        // remove centering class
        $(this).find('.center').removeClass('center');

        var table = $(this);

        // REMOVE ROW SPAN
        var tr_index;
        var td_index;
        var tr_span;

        $(this).find('> tbody > tr').each(function(){
            tr_index = $(this).index()+1;

            $(this).find('> td').each(function(){
                if($(this).attr('rowspan'))
                {
                    td_index = $(this).index()+1;
                    tr_span = $(this).attr('rowspan');

                    // remove rowspan from current line
                    table.find('> tbody > tr:nth-child('+tr_index+') td:nth-child('+td_index+')').removeAttr('rowspan');

                    // re-add column in next lines
                    for(var i = 1; i < tr_span; i++)
                    {
                        table.find('> tbody > tr:nth-child('+(tr_index+i)+') td:nth-child('+td_index+')').before('<td></td>');
                    }
                }
            });
        });

        if(GM_config.get('custom_overview_entity') == true)
        {
            // hide entiteit column
            var column_entity = $(this).find('> thead > tr:nth-child(1) > th:contains("Entiteit")').index() + 1;

            $(this).find('thead tr th:nth-child('+column_entity+')').hide();
            $(this).find('tbody tr td:nth-child('+column_entity+')').hide();
        }

        // MARK TABLE AS PROCESSED
        $(this).addClass('plus-processed');
    });
}

// ***********************************************
// Edit single ticket: History
// ***********************************************
function editTicketSingleHistory()
{
    // highlight today - yesterday
    // remove ID from user
    // change markup

    // change layout
    $('table.table.table-hover').addClass('table search-results table-borderless table-striped table-hover card-table');

    // hide ID column
    var column_id = $('table.search-results thead tr th:contains("ID")').index() + 1;

    $('table.search-results thead tr th:nth-child('+column_id+')').hide();
    $('table.search-results tbody tr td:nth-child('+column_id+')').hide();


    // DATUM
    if(GM_config.get('custom_overview_highlight_dates') == true)
    {
        var column_date = $('table.search-results > thead > tr > th:contains("Datum")').index() + 1;

        var date_check = '';

        var date_today = new Date();
        var date_today_dd = date_today.getDate();
        var date_today_mm = date_today.getMonth() + 1;
        var date_today_yy = date_today.getFullYear();
        date_today = [date_today_dd<10 ? '0'+date_today_dd : date_today_dd, date_today_mm<10 ? '0'+date_today_mm : date_today_mm, date_today_yy].join('-');

        var date_yesterday = new Date();
        date_yesterday.setDate(date_yesterday.getDate() - 1);

        var date_yesterday_dd = date_yesterday.getDate();
        var date_yesterday_mm = date_yesterday.getMonth() + 1;
        var date_yesterday_yy = date_yesterday.getFullYear();
        date_yesterday = [date_yesterday_dd<10 ? '0'+date_yesterday_dd : date_yesterday_dd, date_yesterday_mm<10 ? '0'+date_yesterday_mm : date_yesterday_mm, date_yesterday_yy].join('-');

        // change markup
        $('table.search-results tbody tr td:nth-child('+column_date+')').each(function(){
            date_check = $(this).text();
            date_check = date_check.split(' ')[0];

            if(date_check == date_today)
            {
                $(this).wrapInner('<span></span>').find('span').addClass('itilstatus assigned');
            }
            if(date_check == date_yesterday)
            {
                $(this).wrapInner('<span></span>').find('span').addClass('itilstatus waiting');
            }
        });
    }


    // VELD

    // find
    var column_field = $('table.search-results > thead > tr > th:contains("Veld")').index() + 1;

    // change markup
    $('table.search-results > tbody > tr > td:nth-child('+column_field+')').each(function(){
        var field_string = '';

        var field_text = $(this).text();

        if(field_text.length > 0)
        {
            field_string = field_string + '<span class="glpi-badge">';
            field_string = field_string + field_text;
            field_string = field_string + '</span>';

            $(this).empty();
            $(this).append(field_string);
        }
        else
        {
            $(this).parents('tr').remove();
        }
    });


    // UPDATES

    // find
    var column_updates = $('table.search-results > thead > tr > th:contains("Updaten")').index() + 1;

    // change markup
    $('table.search-results > tbody > tr > td:nth-child('+column_updates+')').each(function(){
        var updates_string = '';

        var updates_text = $(this).html();
        var updates_parts = updates_text.split(': ');
        var updates_icon = '';
        var updates_color = '';
        var updates_field = '';
        var badge_color = '';

        updates_field = $(this).closest('td').prev('td').text();

        if(updates_text.toLowerCase().indexOf('item') !== -1)
        {
            updates_icon = 'ti ti-package';
        }
        if(updates_field.toLowerCase().indexOf('ticket') !== -1 && updates_text.toLowerCase().indexOf('link') !== -1)
        {
            updates_icon = 'ti ti-link';
        }

        if(updates_field.toLowerCase().indexOf('gebruiker') !== -1 || updates_field.toLowerCase().indexOf('aangepast door') !== -1)
        {
            updates_icon = 'ti ti-user';
        }
        if(updates_field.toLowerCase().indexOf('groep') !== -1)
        {
            updates_icon = 'ti ti-users';
        }
        if(updates_field.toLowerCase().indexOf('leverancier') !== -1)
        {
            updates_icon = 'ti ti-package';
        }

        if(updates_field.toLowerCase().indexOf('opvolging') !== -1)
        {
            updates_icon = 'fas fa-comment';

            if(updates_text.toLowerCase().indexOf('actualiseer') !== -1)
            {
                updates_icon = 'fas fa-pencil';
            }
        }
        if(updates_field.toLowerCase().indexOf('taken') !== -1)
        {
            updates_icon = 'far fa-square-check';

            if(updates_text.toLowerCase().indexOf('actualiseer') !== -1)
            {
                updates_icon = 'fas fa-pencil';
            }
        }
        if(updates_field.toLowerCase().indexOf('oplossing') !== -1 || updates_field.toLowerCase().indexOf('afsluit') !== -1)
        {
            updates_color = 'text-solved';
            updates_icon = 'fas fa-check-circle';
        }
        if(updates_field.toLowerCase().indexOf('laatste update') !== -1 || updates_field.toLowerCase().indexOf('tijd') !== -1 || updates_field.toLowerCase().indexOf('datum') !== -1)
        {
            updates_icon = 'far fa-clock';
        }

        if(updates_field.toLowerCase().indexOf('status') !== -1 && updates_text.indexOf('<ins>') !== -1)
        {
            var updates_text_new = updates_text.substring(updates_text.indexOf('<ins>')+'<ins>'.length,updates_text.indexOf('</ins>')).trim();

            if(updates_text_new.toLowerCase().indexOf('nieuw') !== -1)
            {
                badge_color = 'bg-assigned';
                updates_color = 'text-white';
                updates_icon = 'fas fa-circle';
            }
            if(updates_text_new.toLowerCase().indexOf('verwerken') !== -1)
            {
                badge_color = 'bg-assigned';
                updates_color = 'text-white';
                updates_icon = 'far fa-circle';
            }
            if(updates_text_new.toLowerCase().indexOf('wachten') !== -1)
            {
                badge_color = 'bg-waiting';
                updates_color = 'text-white';
                updates_icon = 'fas fa-circle';
            }
            if(updates_text_new.toLowerCase().indexOf('opgelost') !== -1)
            {
                badge_color = 'bg-solved';
                updates_color = 'text-white';
                updates_icon = 'far fa-circle';
            }
            if(updates_text_new.toLowerCase().indexOf('gesloten') !== -1)
            {
                badge_color = 'bg-solved';
                updates_color = 'text-white';
                updates_icon = 'fas fa-circle';
            }
        }


        // add badges
        if(updates_text.indexOf('Wijzig') !== -1)
        {
            updates_icon = updates_icon.length > 0 ? updates_icon : 'fas fa-check';
            updates_color = updates_color.length > 0 ? updates_color : 'text-success';

            // new
            if(updates_text.indexOf('<ins>') !== -1 && $(this).find('ins').html().replace(/&nbsp;/g,'').replace(/\(0\)/g,'').trim().length > 0)
            {
                updates_string += '<span class="glpi-badge tags_already_set me-3 '+badge_color+'"><span class="'+updates_color+'"><i class="'+updates_icon+' me-1"></i> '+updates_text.substring(updates_text.indexOf('<ins>')+'<ins>'.length,updates_text.indexOf('</ins>')).trim()+'</span></span>';
            }

            // old
            if(updates_text.indexOf('<del>') !== -1 && $(this).find('del').html().replace(/&nbsp;/g,'').replace(/\(0\)/g,'').trim().length > 0)
            {
                updates_string += '<span class="glpi-badge tags_already_set"><span class="text-danger"><i class="fas fa-trash me-1"></i> '+updates_text.substring(updates_text.indexOf('<del>')+'<del>'.length,updates_text.indexOf('</del>')).trim()+'</span></span>';
            }
        }
        else if(updates_text.toLowerCase().indexOf('aanpassing') !== -1)
        {
            updates_string += '<span class="glpi-badge tags_already_set"><span class="text-success"><i class="fas fa-pencil me-1"></i> '+updates_text+'</span></span>';
        }
        else if(updates_parts.length >= 2)
        {
            updates_string = '<span class="glpi-badge tags_already_set float-end">'+updates_parts[0]+'</span>';

            // add
            if(updates_parts[0].indexOf('Voeg') !== -1 || updates_parts[0].indexOf('toevoegen') !== -1 || updates_parts[0].toLowerCase().indexOf('actualiseer') !== -1)
            {
                updates_icon = updates_icon.length > 0 ? updates_icon : 'fas fa-check';
                updates_color = updates_color.length > 0 ? updates_color : 'text-success';

                updates_parts.shift();
                updates_string += '<span class="glpi-badge tags_already_set"><span class="'+updates_color+'"><i class="'+updates_icon+' me-1"></i> '+updates_parts.join(': ')+'</span></span>';
            }
            // delete
            else if(updates_parts[0].indexOf('Verwijder') !== -1 || updates_parts[0].indexOf('verwijderen') !== -1)
            {
                updates_icon = updates_icon.length > 0 ? updates_icon : 'fas fa-trash';
                updates_color = updates_color.length > 0 ? updates_color : 'text-danger';

                updates_parts.shift();
                updates_string += '<span class="glpi-badge tags_already_set"><span class="'+updates_color+'"><i class="'+updates_icon+' me-1"></i> '+updates_parts.join(': ')+'</span></span>';
            }
            else
            {
                updates_parts.shift();
                updates_string += '<span class="glpi-badge tags_already_set">'+updates_parts.join(': ')+'</span>';
            }
        }
        else if(updates_text.length > 0)
        {
            updates_string = '<span class="glpi-badge tags_already_set">'+updates_text+'</span>';
        }

        $(this).empty();
        //updates_string += '<br>' + updates_text;
        $(this).append(updates_string);
    });


    // move column VELD forward
    $('table.search-results > thead > tr > th:nth-child('+column_field+')').each(function(){
        $(this).insertBefore($(this).prev());
    });
    $('table.search-results > tbody > tr > td:nth-child('+column_field+')').each(function(){
        $(this).insertBefore($(this).prev());
    });


    // IDS

    // remove ids
    $("table.search-results").html($("table.search-results").html().replace(/\(\d+\)/gi,''));
}


function editTinyMce()
{
    // GLOBAL

    // remove clutter css styles
    //$('body#tinymce *').not('a[href*="/front/user.form.php"] span').css('color','').css('font','').css('font-family','').css('font-size','').css('background','').css('background-color','');

    var editor = $('iframe.tox-edit-area__iframe').contents().find('body#tinymce');
    editor.addClass('testerclass');
}

// ***********************************************
// Edit overview projects
// ***********************************************
function editProjectOverview(jNode)
{
/*
    // HEADER

    if(GM_config.get('custom_overview_entity') == true)
    {
        // hide entiteit column
        var column_entity = $('table.search-results thead tr th[data-searchopt-id="80"]').index() + 1;

        $('table.search-results thead tr th:nth-child('+column_entity+')').hide();
        $('table.search-results tbody tr td:nth-child('+column_entity+')').hide();
    }
*/


    // STATUS

    // find
    var column_status = $('table.search-results thead tr th[data-searchopt-id="12"]').index() + 1;

    // change markup
    $('table.search-results tbody tr td:nth-child('+column_status+')').each(function(){
        var status_string = '';
        var status_color = 'rgb(221 221 221)';
        if($(this).hasClass('shadow-none'))
        {
           status_color = $(this).css('background-color');
        }

        status_string = status_string + '<span class="glpi-badge mt-1">';
        status_string = status_string + '<i class="fas fa-circle me-1" style="color: '+status_color+' !important; "></i>'
        status_string = status_string + $(this).html();
        status_string = status_string + '</span> ';

        $(this).empty();
        $(this).removeClass('shadow-none');
        $(this).css('background-color','transparent');
        $(this).append(status_string);
    });


    // PRIORITY

    // find
    var column_priority = $('table.search-results thead tr th[data-searchopt-id="3"]').index() + 1;

    // change markup
    $('table.search-results tbody tr td:nth-child('+column_priority+')').each(function(){
        var priority_string = '';

        var priority_color = $(this).find('div.priority_block').css('border-color');
        var priority_name = $(this).find('div.priority_block').text();

        priority_string = priority_string + '<span class="glpi-badge mt-1">';
        priority_string = priority_string + '<i class="fas fa-circle me-1" style="color: '+priority_color+' !important; "></i>'
        priority_string = priority_string + priority_name;
        priority_string = priority_string + '</span><br> ';

        $(this).empty();
        $(this).append(priority_string);
    });


    // IDS

    // remove ids
    $("table.search-results").html($("table.search-results").html().replace(/\(\d+\)/gi,''));
}

// ***********************************************
// Edit project overview tickets
// ***********************************************
function editProjectTicketOverview(jNode)
{
    // CHANGE TABLE LAYOUT of tab_cadre_fixehov

    // move table headers to thead
    if($('table.tab_cadre_fixehov thead').length == 0)
    {
        var thead_rows = $('table.tab_cadre_fixehov').find("> tbody > tr > th").parent();

        $('table.tab_cadre_fixehov').prepend('<thead></thead>');
        $('table.tab_cadre_fixehov > thead').append(thead_rows.clone(true));
        $('table.tab_cadre_fixehov > thead > tr:nth-child(2)').remove();

        thead_rows.remove();
    }

    // change layout
    $('table.tab_cadre_fixehov').removeClass('tab_cadre_fixehov').addClass('search-results table card-table table-hover table-striped');


    // STATUS

    // find
    var column_status = $('table.card-table > thead > tr > th:contains("Status")').index() + 1;

    // change markup
    $('table.card-table > tbody > tr > td:nth-child('+column_status+')').each(function(){
        var status_string = '';
        var status_color = $(this).css('background-color');
        if(status_color == 'rgba(0, 0, 0, 0)')
        {
            status_color = 'rgb(221 221 221)';
        }


        status_string = status_string + '<span class="glpi-badge mt-1">';
        status_string = status_string + '<i class="fas fa-circle me-1" style="color: '+status_color+' !important; "></i>'
        status_string = status_string + $(this).html();
        status_string = status_string + '</span> ';

        $(this).empty();
        $(this).css('background-color','transparent');
        $(this).append(status_string);

    });
}


// ***********************************************
// Edit overview assets
// ***********************************************
function editAssetOverview(jNode)
{
    // HEADER

    if(GM_config.get('custom_overview_entity') == true)
    {
        // hide entiteit column
        var column_entity = $('table.search-results thead tr th[data-searchopt-id="80"]').index() + 1;

        $('table.search-results thead tr th:nth-child('+column_entity+')').hide();
        $('table.search-results tbody tr td:nth-child('+column_entity+')').hide();
    }


    // COLUMNS
    var column = '';
    var column_search_id = '';
    var column_string = '';
    var column_content = '';
    var column_color = '';

    // FABRIKANT
    column_search_id = 23;

    // find
    column = $('table.search-results thead tr th[data-searchopt-id="'+column_search_id+'"]').index() + 1;

    // change markup
    $('table.search-results tbody tr td:nth-child('+column+')').each(function(){
        column_string = '';
        column_content = $(this).text();

        if(column_content.length)
        {
            column_string = column_string + '<span class="glpi-badge mt-1">';
            column_string = column_string + column_content;
            column_string = column_string + '</span>';

            $(this).empty();
            $(this).append(column_string);
        }
    });

    // MODEL
    column_search_id = 40;

    // find
    column = $('table.search-results thead tr th[data-searchopt-id="'+column_search_id+'"]').index() + 1;

    // change markup
    $('table.search-results tbody tr td:nth-child('+column+')').each(function(){
        column_string = '';
        column_content = $(this).text();

        if(column_content.length)
        {
            column_string = column_string + '<span class="glpi-badge mt-1">';
            column_string = column_string + column_content;
            column_string = column_string + '</span>';

            $(this).empty();
            $(this).append(column_string);
        }
    });

    // NUMMERPLAAT
    column_search_id = 100;

    // find
    column = $('table.search-results thead tr th[data-searchopt-id="'+column_search_id+'"]').index() + 1;

    // change markup
    $('table.search-results tbody tr td:nth-child('+column+')').each(function(){
        column_string = '';
        column_content = $(this).text();

        if(column_content.length)
        {
            column_string = column_string + '<span class="glpi-badge mt-1">';
            column_string = column_string + column_content;
            column_string = column_string + '</span>';

            $(this).empty();
            $(this).append(column_string);
        }
    });

    // ORGANISATIE-EENHEDEN
    column_search_id = 3;

    // find
    column = $('table.search-results thead tr th[data-searchopt-id="'+column_search_id+'"]').index() + 1;

    // change markup
    $('table.search-results tbody tr td:nth-child('+column+')').each(function(){
        column_string = '';
        column_content = $(this).text();

        if(column_content.length)
        {
            column_color = '';
            if(column_content.indexOf('zzz - ') === 0)
            {
                column_color = 'style="color: #757d91 !important;"';
            }
            column_string = column_string + '<span class="glpi-badge mt-1" '+column_color+'>';
            column_string = column_string + column_content;
            column_string = column_string + '</span>';

            $(this).empty();
            $(this).append(column_string);
        }
    });

    /*
    // ORGANISATIE-EENHEDEN (Radios)
    column_search_id = 16;

    // find
    column = $('table.search-results thead tr th[data-searchopt-id="'+column_search_id+'"]').index() + 1;

    // change markup
    $('table.search-results tbody tr td:nth-child('+column+')').each(function(){
        column_string = '';
        column_content = $(this).text();

        if(column_content.length)
        {
            column_color = '';
            if(column_content.indexOf('zzz - ') === 0)
            {
                column_color = 'style="color: #757d91 !important;"';
            }
            column_string = column_string + '<span class="glpi-badge mt-1" '+column_color+'>';
            column_string = column_string + column_content;
            column_string = column_string + '</span>';

            $(this).empty();
            $(this).append(column_string);
        }
    });
    */

    // SERIENUMMER
    column_search_id = 5;

    // find
    column = $('table.search-results thead tr th[data-searchopt-id="'+column_search_id+'"]').index() + 1;

    // change markup
    $('table.search-results tbody tr td:nth-child('+column+')').each(function(){
        column_string = '';
        column_content = $(this).text();

        if(column_content.length)
        {
            column_string = column_string + '<span class="glpi-badge mt-1">';
            column_string = column_string + column_content;
            column_string = column_string + '</span>';

            $(this).empty();
            $(this).append(column_string);
        }
    });

    // STATUS
    column_search_id = 31;

    // find
    column = $('table.search-results thead tr th[data-searchopt-id="'+column_search_id+'"]').index() + 1;

    // change markup
    $('table.search-results tbody tr td:nth-child('+column+')').each(function(){
        column_string = '';
        column_content = $(this).text();

        if(column_content.length)
        {
            column_string = column_string + '<span class="glpi-badge mt-1">';
            column_string = column_string + column_content.replace(/Actief >/ig,'').replace(/Afgeschreven >/ig,'');
            column_string = column_string + '</span>';

            $(this).empty();
            $(this).append(column_string);
        }
    });

/*
    // STATUS

    // find
    var column_status = $('table.search-results thead tr th[data-searchopt-id="12"]').index() + 1;

    // change markup
    $('table.search-results tbody tr td:nth-child('+column_status+')').each(function(){
        var status_string = '';
        var status_color = 'rgb(221 221 221)';
        if($(this).hasClass('shadow-none'))
        {
           status_color = $(this).css('background-color');
        }

        status_string = status_string + '<span class="glpi-badge mt-1">';
        status_string = status_string + '<i class="fas fa-circle me-1" style="color: '+status_color+' !important; "></i>'
        status_string = status_string + $(this).html();
        status_string = status_string + '</span> ';

        $(this).empty();
        $(this).removeClass('shadow-none');
        $(this).css('background-color','transparent');
        $(this).append(status_string);
    });


    // PRIORITY

    // find
    var column_priority = $('table.search-results thead tr th[data-searchopt-id="3"]').index() + 1;

    // change markup
    $('table.search-results tbody tr td:nth-child('+column_priority+')').each(function(){
        var priority_string = '';

        var priority_color = $(this).find('div.priority_block').css('border-color');
        var priority_name = $(this).find('div.priority_block').text();

        priority_string = priority_string + '<span class="glpi-badge mt-1">';
        priority_string = priority_string + '<i class="fas fa-circle me-1" style="color: '+priority_color+' !important; "></i>'
        priority_string = priority_string + priority_name;
        priority_string = priority_string + '</span> ';

        $(this).empty();
        $(this).append(priority_string);
    });


    // IDS

    // remove ids
    $("table.search-results").html($("table.search-results").html().replace(/\(\d+\)/gi,''));
*/
}


// ***********************************************
// Edit asset overview tickets
// ***********************************************
function editAssetTicketOverview(jNode)
{
    var thead_rows = '';

    // CHANGE TABLE LAYOUT of tab_cadre_fixehov

    if($('table.tab_cadre_fixehov').length)
    {
        $('table.tab_cadre_fixehov').each(function(){

            // move table headers to thead
            if($(this).find('> thead').length == 0)
            {
                thead_rows = $(this).find("> tbody > tr > th").parent();

                $(this).prepend('<thead></thead>');
                $(this).find('> thead').append(thead_rows.clone(true));
                $(this).find('> thead > tr:nth-child(3)').remove();

                thead_rows.remove();
            }

            // change layout
            $(this).removeClass('tab_cadre_fixehov').addClass('search-results table card-table table-hover table-striped');
        });

    }

    // CHANGE TABLE LAYOUT of tab_cadre_fixe

    if($('div.table-responsive > table.tab_cadre_fixe').length)
    {
        $('div.table-responsive > table.tab_cadre_fixe').each(function(){

            // move table headers to thead
            if($(this).find('thead').length == 0)
            {
                thead_rows = $(this).find("> tbody > tr > th").parent();

                $(this).prepend('<thead></thead>');
                $(this).find('> thead').append(thead_rows.clone(true));
                $(this).find('> thead > tr:nth-child(3)').remove();

                thead_rows.remove();
            }

            // change layout
            $(this).removeClass('tab_cadre_fixe').addClass('search-results table card-table table-hover table-striped mt-5');
        });

    }

    // PROCESS SINGLE (unprocessed) TABLE
    $('table.card-table:not(.plus-processed)').each(function(){

        // HEADERS

        // add column for numbers (after title)
        var column_title = $(this).find('> thead > tr:nth-child(2) > th:contains("Titel")').index() + 1;

        if(column_title > 0 && $(this).find('> thead > tr:nth-child(2) > th:nth-child('+column_title+')').clone().children().remove().end().text().indexOf("Titel") >= 0)
        {
            $(this).find('> thead > tr:not(:first-child)').find('> th:nth-child('+column_title+')').after('<th>#</th>');
            $(this).find('> tbody > tr').find('> td:nth-child('+column_title+')').after('<td></td>');

            $(this).find('> thead > tr:first-child > th').attr('colspan',$(this).find('> thead > tr:first-child > th').attr('colspan')+1);
        }

        // shorten the table headers
        $(this).find('> thead > tr:not(:first-child) > th').each(function(){

            if($(this).text().indexOf("Geassocieerde elementen") >= 0)
            {
                $(this).text($(this).text().replace(/Geassocieerde elementen/gi,'Items'));
            }

            if($(this).text().indexOf("Laatste update") >= 0)
            {
                $(this).text($(this).text().replace(/Laatste update/gi,'Update'));
            }
        });

        if(GM_config.get('custom_overview_entity') == true)
        {
            // hide entiteit column
            var column_entity = $(this).find('> thead > tr:nth-child(2) > th:contains("Entiteiten")').index() + 1;

            if(column_entity > 0 && $(this).find('> thead > tr:nth-child(2) > th:nth-child('+column_entity+')').clone().children().remove().end().text().indexOf("Entiteiten") >= 0)
            {
                $(this).find('thead > tr > th:nth-child('+column_entity+')').hide();
                $(this).find('tbody > tr > td:nth-child('+column_entity+')').hide();
            }
        }

        if(true)
        {
            // hide planning column
            var column_plan = $(this).find('> thead > tr:nth-child(2) > th:contains("Planning")').index() + 1;

            if(column_plan > 0 && $(this).find('> thead > tr:nth-child(2) > th:nth-child('+column_plan+')').clone().children().remove().end().text().indexOf("Planning") >= 0)
            {
                $(this).find('> thead > tr:not(":first") > th:nth-child('+column_plan+')').hide();
                $(this).find('> tbody > tr > td:nth-child('+column_plan+')').hide();
            }
        }

        if(GM_config.get('custom_overview_info') == true)
        {
            // hide info icon (popup)
            $(this).find('td span.fas.fa-info').hide();
        }


        // LINKED ITEMS
        // limit number of linked items

        // find
        var column_items = $(this).find('> thead > tr:nth-child(2) > th:contains("Items")').index() + 1;
        var max_items = 5;

        if(column_items > 0 && $(this).find('> thead > tr:nth-child(2) > th:nth-child('+column_items+')').clone().children().remove().end().text().indexOf("Items") >= 0)
        {
            // limit and change markup
            $(this).find('> tbody > tr > td:nth-child('+column_items+')').each(function(){
                var items_string = '';
                var items_total = parseInt($(this).find('span a').length);

                if(items_total > 0)
                {
                    var items_index = 0;
                    $(this).find('span a').each(function(){
                        items_index++;

                        if(items_index <= max_items || GM_config.get('custom_overview_linked') == false)
                        {
                            var item_name = $(this).attr('title');
                            var item_link = $(this).attr('href');
                            var item_badge_nnn = '';

                            if($(this).attr('href').indexOf('peripheral.form.php?id=10982') >= 1)
                            {
                                item_name = 'NNN'
                                item_badge_nnn = 'glpi-badge-nnn';
                            }

                            items_string = items_string + '<span class="glpi-badge '+item_badge_nnn+' mt-1">';
                            items_string = items_string + '<a href="'+item_link+'" title="'+item_name+'">'+item_name+'</a>';
                            items_string = items_string + '</span><br> ';
                        }
                    });
                }

                if(items_total > max_items && GM_config.get('custom_overview_linked') == true)
                {
                    var items_extra = items_total-max_items;
                    items_string = items_string + '<span class="glpi-badge mt-1">+';
                    items_string = items_string + items_extra;
                    items_string = items_string + '</span>';
                }

                $(this).empty();
                $(this).append(items_string);
            });
        }


        // STATUS

        // find
        var column_status = $(this).find('> thead > tr:nth-child(2) > th:contains("Status")').index() + 1;

        if(column_status > 0 && $(this).find('> thead > tr:nth-child(2) > th:nth-child('+column_status+')').clone().children().remove().end().text().indexOf("Status") >= 0)
        {
            // change markup
            $(this).find('> tbody > tr > td:nth-child('+column_status+')').each(function(){
                var status_string = '';
                var status_icon = $(this).find('i.itilstatus').clone();
                var status_id = $(this).text();
                status_id = status_id.substring(status_id.lastIndexOf(':')+2)

                status_string = status_string + '<span class="glpi-badge mt-1">';
                status_string = status_string + status_id;
                status_string = status_string + '</span> ';

                $(this).empty();
                $(this).append(status_string);
                $(this).find('span.glpi-badge').prepend(status_icon);
            });
        }


        // GROUPS
        var group_regex;
        var table;

        // find
        var column_groups = $(this).find('> thead > tr:nth-child(2) > th:contains("Toegewezen")').index() + 1;

        if(column_groups > 0 && $(this).find('> thead > tr:nth-child(2) > th:nth-child('+column_groups+')').clone().children().remove().end().text().indexOf("Toegewezen") >= 0)
        {
            // shorten the text
            table = $(this);

            $.each(groups_short, function(group_short, group_long){
                group_regex = new RegExp(group_long, 'gi');

                table.html(table.html().replace(group_regex,group_short));
            });

            // change markup
            $(this).find('> tbody > tr > td:nth-child('+column_groups+')').each(function(){
                var group_string = '';

                if($(this).text() != "")
                {
                    var group_lines = $(this).html().split("<br>");

                    $.each(group_lines, function(n, elem){
                        if(elem.length > 0)
                        {
                            group_string = group_string + '<span class="glpi-badge mt-1">';
                            group_string = group_string + elem.replace(' &gt; ','&gt;');
                            group_string = group_string + '</span><br> ';
                        }
                    });
                }

                $(this).empty();
                $(this).append(group_string);

            });
        }


        // PRIORITY

        // find
        var column_priority = $(this).find('> thead > tr:nth-child(2) > th:contains("Prioriteit")').index() + 1;

        if(column_priority > 0 && $(this).find('> thead > tr:nth-child(2) > th:nth-child('+column_priority+')').clone().children().remove().end().text().indexOf("Prioriteit") >= 0)
        {
            // change markup
            $(this).find('> tbody > tr > td:nth-child('+column_priority+')').each(function(){
                var priority_string = '';

                var priority_color = $(this).attr('bgcolor');
                var priority_name = $(this).text();

                priority_string = priority_string + '<span class="glpi-badge mt-1">';
                priority_string = priority_string + '<i class="fas fa-circle me-1" style="color: '+priority_color+' !important; "></i>'
                priority_string = priority_string + priority_name;
                priority_string = priority_string + '</span> ';

                $(this).empty();
                $(this).append(priority_string);
                $(this).attr('bgcolor','');
            });
        }


        // TITLE

        // find
        var column_numbers = $(this).find('> thead > tr:nth-child(2) > th:contains("#")').index() + 1;

        if(column_numbers > 0 && $(this).find('> thead > tr:nth-child(2) > th:nth-child('+column_numbers+')').clone().children().remove().end().text().indexOf("#") >= 0)
        {
            // get numbers
            $(this).find('> tbody > tr > td:nth-child('+column_title+')').each(function(){
                var numbers_array = $(this).html().match(/\(\d+ - \d+\)/gi);

                if(numbers_array !== null && numbers_array.length)
                {
                    var numbers_string = numbers_array[0].replace(/[^0-9-]/gi, '');

                    // remove numbers this column
                    $(this).html($(this).html().replace(/\(\d+ - \d+\)/gi,''));

                    // add numbers to other column
                    $(this).parent().find('td:nth-child('+column_numbers+')').append('<span class="glpi-badge mt-1">'+numbers_string+'</span> ');
                }
            });
        }


        // NAME
        // network ports: change name if it is only an ID

        // find
        var column_name = $(this).find('> tbody > tr:nth-child(1) > th:contains("Naam")').index() + 1;

        if(column_name > 0 && $(this).find('> tbody > tr:nth-child(1) > th:nth-child('+column_name+')').clone().children().remove().end().text().indexOf("Naam") >= 0)
        {
            $(this).find('> tbody > tr > td:nth-child('+column_name+')').each(function(){
                $(this).find('a').text($(this).find('a').text().replace(/\((\d+)\)/gi,'[$1]'));
            });
        }


        // IDS

        // remove ids
        $(this).html($(this).html().replace(/\(\d+\)/gi,''));


        // MARK TABLE AS PROCESSED
        $(this).addClass('plus-processed');
    });

    // WIDTH
    $('table.card-table tr:nth-child(2) th:contains("Status")').attr('width','80');
    $('table.card-table tr:nth-child(2) th:contains("Datum")').attr('width','140');
    $('table.card-table tr:nth-child(2) th:contains("Update")').attr('width','140');
    $('table.card-table tr:nth-child(2) th:contains("Prioriteit")').attr('width','100');
    $('table.card-table tr:nth-child(2) th:contains("Titel")').attr('width','500');
}


(function($){
  $.fn.colourBrightness = function(){
    function getBackgroundColor($el) {
      var bgColor = "";
      while($el[0].tagName.toLowerCase() != "html") {
        bgColor = $el.css("background-color");
        if(bgColor != "rgba(0, 0, 0, 0)" && bgColor != "transparent") {
          break;
        }
        $el = $el.parent();
      }
      return bgColor;
    }

    var r,g,b,brightness,
        colour = getBackgroundColor(this);

    if (colour.match(/^rgb/)) {
      colour = colour.match(/rgba?\(([^)]+)\)/)[1];
      colour = colour.split(/ *, */).map(Number);
      r = colour[0];
      g = colour[1];
      b = colour[2];
    } else if ('#' == colour[0] && 7 == colour.length) {
      r = parseInt(colour.slice(1, 3), 16);
      g = parseInt(colour.slice(3, 5), 16);
      b = parseInt(colour.slice(5, 7), 16);
    } else if ('#' == colour[0] && 4 == colour.length) {
      r = parseInt(colour[1] + colour[1], 16);
      g = parseInt(colour[2] + colour[2], 16);
      b = parseInt(colour[3] + colour[3], 16);
    }

    brightness = (r * 299 + g * 587 + b * 114) / 1000;

    if (brightness < 125) {
      // white text
      this.removeClass("background-brightness-light").addClass("background-brightness-dark");
    } else {
      // black text
      this.removeClass("background-brightness-dark").addClass("background-brightness-light");
    }
    return this;
  };
})(jQuery);