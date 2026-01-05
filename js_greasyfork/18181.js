// ==UserScript== 
// @name OGame: Messages 
// @description Messages espionage table
// @namespace OGame: Messages
// @version 1.0.2
// @creator ter3ter 
// @include *://*/game/index.php?page=messages* 
// @include *://*/game/index.php?page=research* 
// @downloadURL https://update.greasyfork.org/scripts/18181/OGame%3A%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/18181/OGame%3A%20Messages.meta.js
// ==/UserScript==      

function strtotime(text, now) {

    // Unecessary spaces 
    text = text.replace(/^\s+|\s+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/[\t\r\n]/g, '')
    .toLowerCase();

    match = text.match(
        /^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);
    
    return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                                        match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
}

function shipCount (m, k, d, cargo)
{
    return Math.ceil (Math.ceil (Math.max (m + k + d, Math.min (0.75 * (m * 2 + k + d), m * 2 + d))) / cargo);
}

function norm_val(s) {
    var mn = 1;
    s = s.replace(/,/, '.');
    if (s.match(/M/)) {
        var rpos = s.length - s.indexOf('.');
        if (rpos == 3) {
           mn = 100000;
        } else if (rpos == 4) {
            mn = 10000;
        } else if (rpos == 5) {
            mn = 1000;
        } else {
            mn = 1000000;
        }
    }
    s = s.replace(/[M,\.]/g, "");
    s *= mn;
    return s;
}

var messages = [];

function parse_messages() {
    var options = loadOptions();
    var v = '';
    if (options.show_all_table == 'no') {
        messages = [];
    }
    $('li.msg').each(function() {
        if ($(this).find('.msg_content>div').length == 4) {
            var coords = $(this).find('.msg_head>span>a').closest('span');
            var met = $(this).find('.msg_content>div.compacting:eq(1)>span.ctn4>span.resspan:eq(0)').text().substring(1).replace(/М/, 'M').replace(/[^0-9M,\.]/g,"");
            met = norm_val(met);
            var kris = $(this).find('.msg_content>div.compacting:eq(1)>span.ctn4>span.resspan:eq(1)').text().replace(/М/, 'M').replace(/[^0-9M,\.]/g,"");
            kris = norm_val(kris);
            var deut = $(this).find('.msg_content>div.compacting:eq(1)>span.ctn4>span.resspan:eq(2)').text().replace(/М/, 'M').replace(/[^0-9M,\.]/g,"");
            deut = norm_val(deut);
            var fleet = $(this).find('.msg_content>div.compacting:eq(3)>span.ctn.ctn4.tooltipLeft').text().replace(/М/, 'M').replace(/[^0-9M,\.]/g,"");
            if (!fleet) {
                fleet = 'Н/Д';
            }
            var def = $(this).find('.msg_content>div.compacting:eq(3)>span.ctn.ctn4.tooltipRight').text().replace(/М/, 'M').replace(/[^0-9M,\.]/g,"");
            if (!def) {
                def = 'Н/Д';
            }
            var link = $(this).find('.msg_actions>a.msg_action_link').attr('href');
            var time = $(this).find('.msg_head>span.msg_date.fright').text();
            
            var nick;
            var status;
            if ($(this).find('.msg_content>div>span.status_abbr_honorableTarget').length) {
                nick = $(this).find('.msg_content>div>span.status_abbr_honorableTarget').text().substr(2);
                status = 'status_abbr_honorableTarget';
            } else if ($(this).find('.msg_content>div>span.status_abbr_longinactive').length) {
                nick = $(this).find('.msg_content>div>span.status_abbr_longinactive').text().substr(2);
                status = 'status_abbr_longinactive';
            } else if ($(this).find('.msg_content>div>span.status_abbr_inactive').length) {
                nick = $(this).find('.msg_content>div>span.status_abbr_inactive').text().substr(2);
                status = 'status_abbr_inactive';
            } else if ($(this).find('.msg_content>div>span.status_abbr_outlaw').length) {
                nick = $(this).find('.msg_content>div>span.status_abbr_outlaw').text().substr(2);
                status = 'status_abbr_outlaw';
            } else if ($(this).find('.msg_content>div>span.status_abbr_noob').length) {
                nick = $(this).find('.msg_content>div>span.status_abbr_noob').text().substr(2);
                status = 'status_abbr_noob';
            } else if ($(this).find('.msg_content>div>span.status_abbr_active').length) {
                nick = $(this).find('.msg_content>div>span.status_abbr_active').text().substr(2);
                status = 'status_abbr_active';
            } 
            var loot =$(this).find('.msg_content>div.compacting:eq(2)>span.ctn.ctn4').text().replace(/\D+/g,"");
            var activ = ' (' + $(this).find('.msg_content>div.compacting:eq(0)>span.fright').text().replace(/\D+/g,"") + ')';
            var all_res = met*1 + kris*1 + deut*1;
            all_res *= loot/100;
            all_res = Math.round(all_res);
            kris *= loot/100;
            kris = Math.round(kris);
            met *= loot/100;
            met = Math.round(met);
            deut *= loot/100;
            deut = Math.round(deut);
            var coords_array = $(this).find('.msg_head>span>a').text().match(/\[([0-9]):([0-9]+):([0-9]+)\]/); 
            var api = $('<b>'+$(this).find('.msg_actions .icon_apikey').attr('title')+'</b>').find('input').attr('value'); 
            if (!api) {
                api = $(this).find('.ago_act_buttons a').attr('href');
                api = api.match(/SR_KEY=([^&]+)/);
                api = api[1];
            }
            
            if (options.table_time == 0 || strtotime(time) > ((new Date()/1000) - 60*options.table_time)) {
                messages.push({
                    coords: coords,
                    coords_array: coords_array[0].match(/[0-9]+/g),
                    met: met,
                    kris: kris,
                    deut: deut,
                    fleet: fleet,
                    def: def,
                    loot: loot,
                    all_res: all_res,
                    nick: nick,
                    link: link,
                    time: time,
                    activ: activ,
                    mt_count: shipCount(met, kris, deut, 5000) + options.add_mt*1,
                    bt_count: shipCount(met, kris, deut, 25000) + options.add_bt*1,
                    api: api
                });
            }
        }
    });
}

function sort_by_res() {
    messages.sort(function(a, b) {
        return b.all_res - a.all_res;
    });
}
function sort_by_time() {
    messages.sort(function(a, b) {
        var d1 = strtotime(a.time);
        var d2 = strtotime(b.time);
        return d2 - d1;
    });
}
function sort_by_def() {
    messages.sort(function(a, b) {
        if (b.def == 'Н/Д') {
            return -1;
        }
        if (a.def == 'Н/Д') {
            return 1;
        }
        console.log(b.def);
        return norm_val(b.def) - norm_val(a.def);
    });
}
function sort_by_fleet() {
    messages.sort(function(a, b) {
        if (b.fleet == 'Н/Д') {
           return -1;
        }
        if (a.fleet == 'Н/Д') {
           return 1;
        }
        return norm_val(b.fleet) - norm_val(a.fleet);
    });
}

function show_table() {
    if ($('#scan_table').length > 0) {
        $('#scan_table').remove();
    }
    var cont = $('.pagination:first');
    var s = '<li id="scan_table"><table style="width: 100%;padding:5px">';
    s += '<tr><th></th><th id="order_time">Время</th><th>Ник</th><th>Координаты</th><th id="order_res">Добыча</th><th id="order_fleet">Флот</th><th id="order_def">Оборона</th><th></th><th>МТ</th><th>БТ</th></tr>';
    var options = loadOptions();
    for(var i in messages) {
        var msg = messages[i];
        s += '<tr>';
        s += '<td style="padding:3px"><input type="checkbox"></td>';
        s += '<td>' + msg.time.substr(11) + '</td>';
        s += '<td><a class="txt_link msg_action_link overlay" href="'+msg.link+'">' + msg.nick + msg.activ + '</a></td>';
        s += '<td><a href="' + msg.coords.find('a').attr('href') + '">'+msg.coords.find('a').text().match(/\[[0-9]:[0-9]+:[0-9]+\]/)+'</a></td>';
        s += '<td title="met: '+msg.met+' kris:'+msg.kris+' deut:'+msg.deut+'">' + msg.all_res.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</td>';
        s += '<td>' + msg.fleet + '</td>';
        s += '<td>' + msg.def + '</td>';
        if (options.sim_type == 'speedsim') {
            s += '<td><a href="#none" class="open_websim" lootp="'+msg.loot+'">sim</a></td>';
        } else {
           var tech110 = getCookie('ogmessages_tech110'); 
           var tech111 = getCookie('ogmessages_tech111');
           var tech115 = getCookie('ogmessages_tech115');
           var tech117 = getCookie('ogmessages_tech117');
           var tech118 = getCookie('ogmessages_tech118');
        }
        if (options.sim_type == 'toprider') {
            var url = 'http://topraider.eu/index.php?SR_KEY='+msg.api+'&speed='+document.getElementsByName('ogame-universe-speed-fleet')[0].content;
            var tech109 = getCookie('ogmessages_tech109');
            if (tech109) {
                url += '&arme='+tech109;
            }
            if (tech110) {
                url += '&bouclier='+tech110;
            }
            if (tech111) {
                url += '&protect='+tech111;
            }
            if (tech115) {
                url += '&combu='+tech115;
            }
            if (tech117) {
                url += '&impu='+tech117;
            }
            if (tech118) {
                url += '&prop='+tech118;
            }
            s += '<td><a target="_blank" href="'+url+'">sim</a></td>';
        }
        s += '<td><a href="/game/index.php?page=fleet1&galaxy='+msg.coords_array[0]+'&system='+msg.coords_array[1]+'&position='+msg.coords_array[2]+'&type=1&mission=1&am202='+msg.mt_count+'">'+msg.mt_count+'</a></td>';
        s += '<td><a href="/game/index.php?page=fleet1&galaxy='+msg.coords_array[0]+'&system='+msg.coords_array[1]+'&position='+msg.coords_array[2]+'&type=1&mission=1&am203='+msg.bt_count+'">' + msg.bt_count + '</a></td>';
    }
    s += '</table></li>';
    cont.after(s);
    $('#order_time').click(function() {
        sort_by_time();
        show_table();
    });
    $('#order_res').click(function() {
        sort_by_res();
        show_table();
    });
    $('#order_def').click(function() {
        sort_by_def();
        show_table();
    });
    $('#order_fleet').click(function() {
        sort_by_fleet();
        show_table();
    });
    $('.open_websim').click(function() {
        var tr = $(this).closest('tr');
        var full_link = tr.find('td>a.msg_action_link').attr('href');
        $.get(full_link, function(data) {
            var dom = $(data);
            var ships = {};
            var url = 'http://websim.speedsim.net/?';
            for (i = 202;i<216;i++) {
                if (dom.find('.tech'+i).length == 1) {
                    var num = i - 202;
                    url += 'ship_d0_'+num+'_b='+dom.find('.tech'+i).closest('.detail_list_el').find('span.fright').text().replace(/\D+/g,"")+'&';
                }
            }
            for (i = 401;i<409;i++) {
                if (dom.find('.defense'+i).length == 1) {
                    var num = i - 401 + 14;
                    url += 'ship_d0_'+num+'_b='+dom.find('.defense'+i).closest('.detail_list_el').find('span.fright').text().replace(/\D+/g,"")+'&';
                }
            }
            url += 'enemy_metal=' + norm_val(dom.find('.resourceIcon.metal').closest('.resource_list_el').find('.res_value').text());
            url += '&enemy_crystal=' + norm_val(dom.find('.resourceIcon.crystal').closest('.resource_list_el').find('.res_value').text());
            url += '&enemy_deut=' + norm_val(dom.find('.resourceIcon.deuterium').closest('.resource_list_el').find('.res_value').text());
            url += '&enemy_pos=' + tr.find('td:eq(3)>a').text().replace(/[\[\]]/g,'');
            var options = loadOptions();
            if (options.sim_send_tech == 'yes') {
                if (options.sim_need_tech == 'no' || dom.find('.research109').length == 1 || dom.find('.research110').length == 1 || dom.find('.research111').length == 1) 
                {
                    if (dom.find('.research109').length == 1) {
                        url += '&tech_d0_0='+dom.find('.research109').closest('.detail_list_el').find('.fright').text();
                    }
                    if (dom.find('.research110').length == 1) {
                        url += '&tech_d0_1='+dom.find('.research110').closest('.detail_list_el').find('.fright').text();
                    }
                    if (dom.find('.research111').length == 1) {
                        url += '&tech_d0_2='+dom.find('.research111').closest('.detail_list_el').find('.fright').text();
                    }
                    var tech109 = getCookie('ogmessages_tech109');
                    if (tech109) {
                        url += '&tech_a0_0='+tech109;
                    }
                    var tech110 = getCookie('ogmessages_tech110');
                    if (tech110) {
                        url += '&tech_a0_1='+tech110;
                    }
                    var tech111 = getCookie('ogmessages_tech111');
                    if (tech111) {
                        url += '&tech_a0_2='+tech111;
                    }
                    var tech115 = getCookie('ogmessages_tech115');
                    if (tech115) {
                        url += '&engine0_0='+tech115;
                    }
                    var tech117 = getCookie('ogmessages_tech117');
                    if (tech117) {
                        url += '&engine0_1='+tech117;
                    }
                    var tech118 = getCookie('ogmessages_tech118');
                    if (tech118) {
                        url += '&engine0_2='+tech118;
                    }
                }
                
            }
            url += '&uni_speed=' + $("meta[name=ogame-universe-speed-fleet]").attr('content');
            url += '&start_pos=' + $("meta[name=ogame-planet-coordinates]").attr('content');
            url += '&plunder_perc=' + tr.find('a.open_websim').attr('lootp');
            var api_url = 'http://' + $("meta[name=ogame-universe]").attr('content') + '/api/serverData.xml';
            $.get(api_url, function(data) {
                url += '&perc-df='+$(data).find('debrisFactor').text()*100;
                url += '&def_to_df='+$(data).find('defToTF').text();
                if (navigator.userAgent.search(/Firefox/) > -1) {
                    unsafeWindow.open(url, '_blank');
                } else {
                    GM_openInTab(url);
                }
            });
            return false;
        });

    });
}

function do_msg() {
    parse_messages();

    show_table()
}

function setCookie(name, value) {
  options = {};

  var d = new Date();
  d.setTime(d.getTime() + 3600*24*365 * 1000);
  options.expires = d.toUTCString();

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }
  document.cookie = updatedCookie;
}

function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function update_tech() {
     [109, 110, 111, 115, 117, 118].forEach(function(item, i, arr) {
         if ($('a#details'+item+' span.level').length == 1) { 
             var tech = $('a#details'+item+' span.level').text().replace(/[^0-9M]/g,"");
             setCookie('ogmessages_tech'+item, tech);
         }
     }); 
}

function loadOptions() {
    var options = {};
    if (getCookie('ogmessages_option_send_tech') == 'no') {
        options.sim_send_tech = 'no';
    } else {
        options.sim_send_tech = 'yes';
    }
    if (getCookie('ogmessages_option_need_tech') == 'no') {
        options.sim_need_tech = 'no';
    } else {
        options.sim_need_tech = 'yes';
    }
    if (getCookie('ogmessages_option_show_all_table') == 'no') {
        options.show_all_table = 'no';
    } else {
        options.show_all_table = 'yes';
    }
    if (getCookie('ogmessages_option_show_all_messages') == 'no') {
        options.show_all_messages = 'no';
    } else {
        options.show_all_messages = 'yes';
    }
    options.sim_type = 'speensim';
    if (getCookie('ogmessages_option_sim_type') != undefined) {
        options.sim_type = getCookie('ogmessages_option_sim_type');
    }
    options.add_mt = 0;
    options.add_bt = 0;
    options.table_time = 0;
    if (getCookie('ogmessages_option_add_mt') != undefined) {
        options.add_mt = getCookie('ogmessages_option_add_mt');
    }
    if (getCookie('ogmessages_option_add_bt') != undefined) {
        options.add_bt = getCookie('ogmessages_option_add_bt');
    }
    if (getCookie('ogmessages_option_table_time') != undefined) {
        options.table_time = getCookie('ogmessages_option_table_time');
    }
    return options;
}

function saveOptions(options) {
    setCookie('ogmessages_option_send_tech', options.sim_send_tech);
    setCookie('ogmessages_option_need_tech', options.sim_need_tech);
    setCookie('ogmessages_option_sim_type', options.sim_type);
    setCookie('ogmessages_option_add_bt', options.add_bt);
    setCookie('ogmessages_option_add_mt', options.add_mt);
    setCookie('ogmessages_option_show_all_table', options.show_all_table);
    setCookie('ogmessages_option_show_all_messages', options.show_all_messages);
    setCookie('ogmessages_option_table_time', options.table_time);
}

var savedContent = false;
function showOptions() {
    if (!savedContent) {
        savedContent = $('#contentWrapper').html();
        $('#contentWrapper').html('<div id="oGameVersionCheck">' +
                                  '<div style="color: rgb(132, 132, 132); margin: 0px; padding: 17px 0px 10px; width: 100%; text-align: center; background: 5px 0px repeat-y scroll black;">' +
                                  '<table style="width: 100%">'+
                                  '<tr><td>Отправлять в сим техи</td><td><input type="checkbox" id="ogmessages_sim_send_tech"></td>' +
                                  '<tr><td>Отправлять в сим свои техи только если известны техи цели(работает только с парсингом доклада)</td><td><input type="checkbox" id="ogmessages_sim_need_tech"></td>' +
                                  '<tr><td>Используемый симулятор</td><td><select id="ogmessages_sim_type" style="visibility:visible">' + 
                                  '<option value="toprider">Открыть через topraider(api)</option>' +
                                  '<option value="speedsim">SpeedSim(парсинг доклада)</option>' +
                                  '</select></td>' +
                                  '<tr><td colspan=2><hr></td></tr>' +
                                  '<tr><td>Добавлять МТ к расчётным</td><td><input type="text" id="ogmessages_add_mt" value="0"></td>' +
                                  '<tr><td>Добавлять БТ к расчётным</td><td><input type="text" id="ogmessages_add_bt" value="0"></td>' +
                                  '<tr><td colspan=2><hr></td></tr>' +
                                  '<tr><td>Показывать в таблице все уже загруженные сообщения</td><td><input type="checkbox" id="ogmessages_show_all_table"></td>' +
                                  '<tr><td>Показывать сообщения не старше, минут(0 - показывать все)</td><td><input type="text" id="ogmessages_table_time" value="0"></td>' +
                                  '<tr><td colspan="2"><input type="button" value="Сохранить" id="ogmessages_save_options"></td>' +
                                  '</table></div></div>');
        var options = loadOptions();
        if (options.sim_send_tech == 'yes') {
            $('#ogmessages_sim_send_tech').attr('checked', 'checked');
        }
        if (options.sim_need_tech == 'yes') {
            $('#ogmessages_sim_need_tech').attr('checked', 'checked');
        }
        if (options.show_all_table == 'yes') {
            $('#ogmessages_show_all_table').attr('checked', 'checked');
        }
        if (options.sim_type) {
            $("#ogmessages_sim_type option[value='"+options.sim_type+"']").prop("selected", true);
        }
        $('#ogmessages_add_mt').val(options.add_mt);
        $('#ogmessages_add_bt').val(options.add_bt);
        $('#ogmessages_table_time').val(options.table_time);
        $('#ogmessages_save_options').click(function() {
            var options = {};
            options.sim_send_tech = 'no';
            options.sim_need_tech = 'no';
            options.show_all_table = 'no';
            options.show_all_messages = 'no';
            if ($('#ogmessages_sim_send_tech').prop('checked') == true) {
                 options.sim_send_tech = 'yes';
            }
            if ($('#ogmessages_sim_need_tech').prop('checked') == true) {
                 options.sim_need_tech = 'yes';
            }
            if ($('#ogmessages_show_all_table').prop('checked') == true) {
                 options.show_all_table = 'yes';
            }
            options.sim_type = $("#ogmessages_sim_type").val();
            options.add_mt = $("#ogmessages_add_mt").val();
            options.add_bt = $("#ogmessages_add_bt").val();
            options.table_time = $("#ogmessages_table_time").val();
            saveOptions(options);
            showOptions();
        });
    } else {
        $('#contentWrapper').html(savedContent);
        savedContent = false;
    }
}

$(document).ready(function() {
    $(document).ajaxSuccess(function(e,xhr,settings) {
		if (!settings.url.indexOf("page=messages&tab=20&ajax=1") || !(settings.url.indexOf("page=messages") && settings.data && settings.data.indexOf('tabid=20'))) return;
        if ($('.msg_status').length > 0) {
            do_msg();
        }
    });
    if ($('#links').length > 0) {
        $('#links').append('<ul class="leftmenu">' +
                           '<li><a id="ogameMassagesOptionsButton" class="menubutton" href="javascript:void(0)" style="color: rgb(255, 75, 0);"><span class="textlabel">OG: Messages</span></a></li>'+
                           '</ul>');
    }
    $(document).on('click', '#ogameMassagesOptionsButton', function() {
        showOptions();
    });
    if ($('a#details109').length == 1) {
        update_tech();
    }
    //alert(getCookie('ogmessages_tech111'));
});