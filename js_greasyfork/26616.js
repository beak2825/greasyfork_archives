// ==UserScript==
// @name        NBOSS_jira-kill
// @namespace   nboss
// @include     https://nexus.ntteo.net/angora-op-gui-eu?action*
// @include     https://nexus.ntteo.net/angora-op-gui-eu*
// @include     https://nexus.ntteo.net/op-eu*
// @version     1.1
// @author		Iñaki
// @description Script de mejora para NBOSS (pitotsu-kill jira)
// @downloadURL https://update.greasyfork.org/scripts/26616/NBOSS_jira-kill.user.js
// @updateURL https://update.greasyfork.org/scripts/26616/NBOSS_jira-kill.meta.js
// ==/UserScript==

url=document.location.toString();
task_regex = /view-tasks/;
edit_ticket = /edit-tickets/;

if (url.match(task_regex)){
    var ticket_created = $("div#work-log tr:eq(4) td:eq(8)").text();
    var team_created = $('div#work-log tr:last').prev().text();
    var cliente = $('div#page-content:contains("Summary") tr:eq(12) td a:eq(0)').text();
    var contacts = $('div#page-content:contains("Summary") tr:eq(12) td').text();
    var info_ticket = $("div#page-content div.section_content tr:contains('Ticket / Parent')").text();
    var ticket_title = $('table.single-row tr:eq(0) td').text();
    var task_title = $('table.single-row tr:eq(1) td').text();
    if (info_ticket.indexOf("Internal") != -1){
        var link = $('div#navbar-inner a').eq(2);
        if (link.text().slice(0,5) == "TK-EU"){
            var ticket_url = 'https://nexus.ntteo.net/' + link.attr('href');
            var ticket_id = 'TK-EU-' + ticket_url.slice(-8);
            var task_url = window.location.href;
        }else{
            var ticket_id = $('div#navbar-inner').text().slice(-14);
            var task_url = "https://nexus.ntteo.net/"+$('div.section_content:contains(Tasks) tr:eq(2) a:eq(1)').attr('href');
            var ticket_url = 'https://nexus.ntteo.net/angora-op-gui-eu?action=view-tickets&id=' +  ticket_id;
        }
        if ((cliente == "ReAssure")&&(team_created.indexOf("NTTCMS AlertManager") != -1)&&(ticket_title.indexOf("[op5]") != -1)&&(contacts.indexOf("(do not assign tickets)") != -1)){
            if(window.confirm("Do you want to PUBLISH this ReAssure ticket?")){
                window.location.href = 'https://nexus.ntteo.net/angora-op-gui-eu?action=edit-tickets&id=' + ticket_id.slice(6) + '&search=reassure-cambiar-internal';
            }else{
                window.location.href = 'https://nexus.ntteo.net/angora-op-gui-eu?action=edit-tickets&id=' + ticket_id.slice(6) + '&search=reassure-contacts';
            }
        }else{
            var edit_ticket = 'https://nexus.ntteo.net/angora-op-gui-eu?action=edit-tickets&id=' + ticket_id.slice(6) + '&search=cambiar-internal';
        }
        $("div#page-content").prepend( '<div align="center" style="background-color:#ff6666; height:60px; line-height: 60px; text-shadow: 0px 5px 2px rgba(150, 150, 150, 1); color:white; font-weight: bold;">THIS IS AN INTERNAL TICKET (<a style="font-decoration:none; text-shadow:none;" href="'+edit_ticket+'" target="_blank">Edit ticket</a>)</div>' );
        $('input[value="Ask Question"]').click( function(event){
            alert('This is an Internal ticket, before submitting this form you need to change it to Portal+email');
            event.preventDefault();
        });
    }
}

if (url.match(edit_ticket)){
    if (url.match("&search=cambiar-internal")){
        $("select[name='dbfield:3:__raw_custom__:__single__:publication_type'] option[value='3']").attr('selected', true); //Portal+email
        $('input[value="Update"]').click();
    }else{
        if (url.match("&search=reassure-cambiar-internal")){
            $("select[name='dbfield:3:__raw_custom__:__single__:publication_type'] option[value='3']").attr('selected', true); //Portal+email
            $("#FPAR_related_customer_portal_users__sel > option").each(function() {
                if ((this.text != "*ServiceDesk")&&(this.text != "*High Priority Incident Group")){
                    $("select[name='FPAR_related_customer_portal_users__sel'] option[value='"+this.value+"']").attr('selected', true);
                }
            });
            $('div.section_content:contains("Associated Customer Portal Users") input[value="<== Del"]').click();
            $('#FPAR_related_customer_portal_users__notsel option').attr('selected', false);
            $("select[name='FPAR_related_operator_portal_users__notsel'] option[value='27828']").attr('selected', true); //*Service Desk
            $("select[name='FPAR_related_customer_portal_users__notsel'] option[value='27960']").attr('selected', true); //*High Priority Incident Group
            $('input#FPAR_related_customer_portal_users_add_button').click();
            $('input[value="Update"]').click();
        }
        if (url.match("&search=reassure-contacts")){
            $("#FPAR_related_customer_portal_users__sel > option").each(function() {
                if ((this.text != "*ServiceDesk")&&(this.text != "*High Priority Incident Group")){
                    $("select[name='FPAR_related_customer_portal_users__sel'] option[value='"+this.value+"']").attr('selected', true);
                }
            });
            $('div.section_content:contains("Associated Customer Portal Users") input[value="<== Del"]').click();
            $('#FPAR_related_customer_portal_users__notsel option').attr('selected', false);
            $("select[name='FPAR_related_operator_portal_users__notsel'] option[value='27828']").attr('selected', true); //*Service Desk
            $("select[name='FPAR_related_customer_portal_users__notsel'] option[value='27960']").attr('selected', true); //*High Priority Incident Group
            $('input#FPAR_related_customer_portal_users_add_button').click();
            $('input[value="Update"]').click();
        }
    }
}

/* CHANGELOG
1.1
- Arreglado fallo con variables de texto 

1.0
- Añadidas funciones para ReAssure

*/