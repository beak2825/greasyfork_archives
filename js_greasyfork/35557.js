// ==UserScript==
// @name         IP Checker: Unlimited
// @namespace    IPCheckerUnlimited
// @version      1.2.1
// @description  A little userscript that checks an unlimited number of IP addresses to make sure they are online.
// @author       SmartishYT
// @match        *://*.hackerexperience.com/*
// @downloadURL https://update.greasyfork.org/scripts/35557/IP%20Checker%3A%20Unlimited.user.js
// @updateURL https://update.greasyfork.org/scripts/35557/IP%20Checker%3A%20Unlimited.meta.js
// ==/UserScript==

const ISP_IP = '1.158.201.174';

var IPChecker = {};

IPChecker.Utils = {};

IPChecker.Utils.isGritterLoaded = false;
IPChecker.Utils.notify = function(title, message) {
    if (!IPChecker.Utils.isGritterLoaded) {
        $('<link rel="stylesheet" type="text/css" href="css/jquery.gritter.css">').appendTo('head');
        $.getScript('js/jquery.gritter.min.js', function() {
            $.gritter.add({
                title: title,
                text: message,
                image: '',
                sticky: false
            });
        });
        IPChecker.Utils.isGritterLoaded = true;
        return;
    }
    $.gritter.add({
        title: title,
        text: message,
        image: '',
        sticky: false
    });
};

IPChecker.Utils.getParameterByName = function(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

IPChecker.Utils.validateIP = function(ipAddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipAddress) && ipAddress !== ISP_IP) {
        return true;
    }
    return false;
};

IPChecker.Utils.isLoggedIn = function() {
    return $('a[href="logout"]').length > 0;
};

IPChecker.Utils.isOnPage = function(page) {
    return window.location.pathname === page;
};

IPChecker.Checker = {};

IPChecker.Checker.linkToInject = '<span class="pull-right hide-phone"><a href="javascript:void(0)" id="ipCheckLink">Check IP\'s</a></span>';
IPChecker.Checker.inputModal = '<div class="fade modal"role=dialog id=inputModal tabindex=-1><div class=modal-dialog role=document><div class=modal-content><div class=modal-header><button class=close type=button data-dismiss=modal aria-label=Close></button><h4 class=modal-title>IP Checker</h4></div><form id=inputForm><div class=modal-body><div class=form-group><label class=control-label for=ipInput>Please input your IP\'s or logs below and it will give you back all existing IP\'s.</label><textarea class=form-control id=ipInput placeholder="Place your IP\'s or logs here"rows=10 style=min-width:90%></textarea></div></div><div class=modal-footer><button class="btn btn-default"type=button data-dismiss=modal>Close</button> <button class="btn btn-primary"type=submit id=inputSubmitButton>Check my IP\'s</button></div></form></div></div></div>';
IPChecker.Checker.isChecking = false;
IPChecker.Checker.totalChecked = 0;
IPChecker.Checker.totalIPsToCheck = 0;
IPChecker.Checker.nonExisting = 0;
IPChecker.Checker.errors = 0;
IPChecker.Checker.NPCs = [];
IPChecker.Checker.VPCs = [];
IPChecker.Checker.ClanServers = [];
IPChecker.Checker.IPsToCheck = [];
IPChecker.Checker.currentIP;

IPChecker.Checker.bindLinkEvent = function() {
    $('#ipCheckLink').on('click', function(event) {
        IPChecker.Checker.ipCheckLinkClick();
    });
};

IPChecker.Checker.ipCheckLinkClick = function() {
    $('#inputModal').modal('show');
    $('.modal-backdrop').removeClass('modal-backdrop');
};

IPChecker.Checker.checkIPs = function(ipArray) {
    if (!IPChecker.Checker.isChecking) {
        IPChecker.Checker.isChecking = true;
        IPChecker.Checker.totalChecked = 0;
        IPChecker.Checker.nonExisting = 0;
        IPChecker.Checker.errors = 0;
        IPChecker.Checker.NPCs = [];
        IPChecker.Checker.VPCs = [];
        IPChecker.Checker.ClanServers = [];

        IPChecker.Checker.totalIPsToCheck = ipArray.length;
        IPChecker.Checker.IPsToCheck = ipArray;

        $('#inputSubmitButtonAmountTotal').text(IPChecker.Checker.totalIPsToCheck);

        IPChecker.Checker.checkIPArray();
    }
};

IPChecker.Checker.checkIPArray = function() {
    if (IPChecker.Checker.isChecking) {
        if (IPChecker.Checker.totalChecked === IPChecker.Checker.totalIPsToCheck) {
            $.get(window.location.origin + '/internet?ip=' + IPChecker.Checker.currentIP).always(function() {
                IPChecker.Checker.finishSubmit();
            });
            return;
        }

        var ip = IPChecker.Checker.IPsToCheck[0];
        IPChecker.Checker.IPsToCheck.splice(0, 1);

        $.get(window.location.origin + '/internet?ip=' + ip).done(function(data) {
                if ($('.widget-content:contains("404")', data).length) {
                    IPChecker.Checker.nonExisting++;
                } else {
                    switch ($('.label.pull-right', data).text()) {
                        case 'NPC':
                            IPChecker.Checker.VPCs.push(ip);
                            break;
                        case 'VPC':
                            IPChecker.Checker.VPCs.push(ip);
                            break;
                        case 'Clan Server':
                            IPChecker.Checker.VPCs.push(ip);
                            break;
                        default:
                            IPChecker.Checker.VPCs.push(ip);
                    }
                }
            }).fail(function() {
                IPChecker.Checker.errors++;
            }).always(function() {
                IPChecker.Checker.totalChecked++;
                IPChecker.Checker.checkIPArray();
                $('#inputSubmitButtonAmountDone').text(IPChecker.Checker.totalChecked);
            });
    }
};

IPChecker.Checker.submitInput = function() {
    $('#inputSubmitButton').prop('disabled', true);
    $('#inputSubmitButton').html('Working on it (<span id="inputSubmitButtonAmountDone">0</span>/<span id="inputSubmitButtonAmountTotal">0</span>)');

    var validIPs = [...new Set($('#ipInput').val().match(/(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g))].filter(IPChecker.Utils.validateIP);

    if (validIPs.length == 0) {
        IPChecker.Utils.notify('HE IP Checker', 'You didn\'t input any IP\'s or all your IP\'s were invalid or you only put in the ISP IP which doesn\'t get checked.');

        $('#inputSubmitButton').prop('disabled', false);
        isChecking = false;
        $('#inputSubmitButton').text('Check my IP\'s');
        IPChecker.Checker.bindLinkEvent();

        return;
    }

    if (validIPs.length > false) {
       
    }

    IPChecker.Checker.checkIPs(validIPs);
};

IPChecker.Checker.finishSubmit = function() {
    var text = 'Checked ' + IPChecker.Checker.totalIPsToCheck + ' IP\'s of which ' + IPChecker.Checker.nonExisting + ' didn\'t exist (' + IPChecker.Checker.errors + ' errors occurred). There were ' + IPChecker.Checker.NPCs.length + ' NPC\'s, ' + IPChecker.Checker.VPCs.length + ' VPC\'s and ' + IPChecker.Checker.ClanServers.length + ' Clan servers.';
    if (IPChecker.Checker.NPCs.length > 0) {
        text += '\n\nNPC IP\'s (' + IPChecker.Checker.NPCs.length + ')\n\n';
        text += IPChecker.Checker.NPCs.join('\n');
    }
    if (IPChecker.Checker.VPCs.length > 0) {
        text += '\n\nVPC IP\'s (' + IPChecker.Checker.VPCs.length + ')\n\n';
        text += IPChecker.Checker.VPCs.join('\n');
    }
    if (IPChecker.Checker.ClanServers.length > 0) {
        text += '\n\nClan Server IP\'s (' + IPChecker.Checker.ClanServers.length + ')\n\n';
        text += IPChecker.Checker.ClanServers.join('\n');
    }

    $('#ipInput').val(text);
    $('#inputSubmitButton').prop('disabled', false);
    IPChecker.Checker.isChecking = false;
    $('#inputSubmitButton').html('Check my IP\'s');
    IPChecker.Checker.bindLinkEvent();
};

$(document).ready(function() {
    if (IPChecker.Utils.isLoggedIn()) {
        $('#breadcrumb').append(IPChecker.Checker.linkToInject);
        $('body').append(IPChecker.Checker.inputModal);

        $('#inputForm').submit(function(event) {
            event.preventDefault();
            IPChecker.Checker.submitInput();
        });

        if (IPChecker.Utils.isOnPage('/internet') && IPChecker.Utils.getParameterByName('ip') && IPChecker.Utils.validateIP(IPChecker.Utils.getParameterByName('ip'))) {
            IPChecker.Checker.currentIP = IPChecker.Utils.getParameterByName('ip');
        } else {
            IPChecker.Checker.currentIP = '1.2.3.4';
        }

        IPChecker.Checker.bindLinkEvent();
    }
});