// ==UserScript==
// @name         Asus Router Extensions
// @namespace    asusex
// @version      0.1
// @description  ChoMPi Rulez!
// @author       ChoMPi
// @match        http://192.168.1.1/Main_ConnStatus_Content.asp
// @grant        none
// @require 	 http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/17575/Asus%20Router%20Extensions.user.js
// @updateURL https://update.greasyfork.org/scripts/17575/Asus%20Router%20Extensions.meta.js
// ==/UserScript==

$(document).ready(function()
{
    var logs = $('textarea').val();
    
    if ($('textarea').length == 0 || logs.length == 0)
        return;
    
    var lines = logs.split('\n');
    
    //var objects = [];
    var distinct_nat = [];
    var nat_connections = [];
    
    for (var i = 0; i < lines.length; i++)
    {
        var parts = lines[i].replace(/ +(?= )/g,'').split(' ');
        
        if (parts[0] == 'Proto')
            continue;
        
        var nat = (typeof parts[1] != 'undefined') ? parts[1].split(':') : ['0.0.0.0', '0'];
        var dest = (typeof parts[2] != 'undefined') ? parts[2].split(':') : ['0.0.0.0', '0'];
        
        // Create an object
        var object = { type: parts[0], nat_ip: nat[0], nat_port: nat[1], dest_ip: dest[0], dest_port: dest[1], status: parts[3], raw: lines[i] };
        
        // Add to the distinct nat ips
        var natIndex = distinct_nat.indexOf(object.nat_ip);
        
        if (natIndex == -1)
        {
            distinct_nat.push(object.nat_ip);
            nat_connections.push( [ object ] );
        }
        else
        {
            nat_connections[natIndex].push(object);
        }
    }
    
    // clear the distinct array
    distinct_nat.splice(0, distinct_nat.length);
    distinct_nat = null;
    
    // Sort the nat connections
    nat_connections.sort(function(a, b)
    {
  		return b.length - a.length;
	});
    
    // Add info about our new feature
    $('textarea').parent().parent().append('<div class="formfontdesc" style="margin-top: 30px;">History log of active connections grouped by NATed addresses.</div>');
    
    // Create a new dom container
    var container = $('textarea').parent().parent().append('<div style="margin-top: 10px;">' +
                                                           		'<div id="nat_menu" style="margin-bottom: -5px;"></div>' +
                                                           		'<div id="nat_contents"></div>' +
                                                           '</div>');
    
    for (var i2 = 0; i2 < nat_connections.length; i2++)
    {
        if (nat_connections[i2].length <= 1)
            continue;
       	
        var btn = $('<a href="#" style="display: inline-block; text-shadow: 1px 1px 1px rgba(0,0,0,0.5); margin-right: 5px; margin-bottom: 5px; min-width: 10px;" data-id="' + i2 + '" class="nat_btn titlebtn"><span>' + nat_connections[i2][0].nat_ip + '(' + nat_connections[i2].length + ')</span></a>');
        
        $(btn).click(function()
        {
            var id = $(this).attr('data-id');
            
            if ($(this).hasClass('active'))
            {
                $('#nat_content_' + id).hide();
                $(this).removeClass('active');
                $(this).css("background-position", "");
                $(this).find('span').css("background-position", "");
            }
            else
            {
                var currentActive = $('.nat_btn.active');
                
                if (currentActive.length > 0)
                {
                    $('#nat_content_' + currentActive.attr('data-id')).hide();
                    currentActive.removeClass('active');
                    currentActive.css("background-position", "");
                    currentActive.find('span').css("background-position", "");
                }
                
                $('#nat_content_' + id).show();
                $(this).addClass('active');
                $(this).css("background-position", "right -68px");
                $(this).find('span').css("background-position", "left -68px");
            }
            
        	return false;
        });
        
       	$('#nat_menu', container).append(btn);
        $('#nat_contents', container).append('<textarea id="nat_content_' + i2 + '" style="display: none; font-family:\'Courier New\', Courier, mono; font-size:13px; background:#475A5F; color:#FFFFFF; width: 99%; height: 400px; margin-top: 5px;"></textarea>');
        
        // Add the raw records from the original logs
        for (var i3 = 0; i3 < nat_connections[i2].length; i3++)
        {
            var text = nat_connections[i2][i3].raw;
            
            // Remove empty spaces to make it fit
            text = text.substring(0, 41) + text.substring(47, text.length);
			text = text.substring(0, 75) + text.substring(81, text.length);
            
        	$('#nat_content_' + i2).val($('#nat_content_' + i2).val() + text + '\n');
        }
    }
    
    $('#nat_menu', container).append('<div style="clear: both;"></div>');
});