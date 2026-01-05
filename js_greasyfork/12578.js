// ==UserScript==
// @name        Smartfren Andromax M2P Dashboard Info Extended
// @namespace   smartfren.m2p 192.168.8.1
// @description Menambahkan info tambahan yang tersembunyi dari user biasa berupa info PCI, MCC/MNC, kekuatan sinyal, daya baterai, dan kecepatan.
// @include     http://smartfren.m2p/html/*
// @include     http://192.168.*.1/html/*
// @version     0.1.1a
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12578/Smartfren%20Andromax%20M2P%20Dashboard%20Info%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/12578/Smartfren%20Andromax%20M2P%20Dashboard%20Info%20Extended.meta.js
// ==/UserScript==

// Perubahan width tooltip
$.fn.qtip.styles.defaults.width.min = 150;
$.fn.qtip.styles.defaults.width.max = 200;

// Fungsi memberi warna pada item-item tooltip kekuatan sinyal
var signal_strength_colorize = function (type,string)
{
	var num = parseInt(string);
	var color = '';
	switch (type)
  {
      case 'rssi':
        if (string === ">=-51dBm")
          color = '#00FF00';
        else if (num < -51 && num >= -77)
          color = '#7FFF00';
        else if (num < -77 && num >= -85)
          color = '#FFFF00';
        else if (num < -85 && num >= -100)
          color = '#FF7F00';
        else if (num < -100)
          color = '#FF0000';
        else
          color = '#FFF';
      break;
      case 'rsrp':
        if (num >= -80)
          color = '#00FF00';
        else if (num < -80 && num >= -90)
          color = '#7FFF00';
        else if (num < -90 && num >= -100)
          color = '#FF7F00';
        else if (num < -100)
          color = '#FF0000';
        else
          color = '#FFF';
      break;
      case 'rsrq':
        if (num >= -10)
          color = '#00FF00';
        else if (num < -10 && num >= -15)
          color = '#7FFF00';
        else if (num < -15 && num >= -20)
          color = '#FF7F00';
        else if (num < -20)
          color = '#FF0000';
        else
          color = '#FFF';
      break;
      case 'sinr':
        if (num >= 20)
          color = '#00FF00';
        else if (num < 20 && num >= 13)
          color = '#7FFF00';
        else if (num < 13 && num >= 10)
          color = '#FFFF00';
        else if (num < 10 && num >= 0)
          color = '#FF7F00';
        else if (num < 0 || string === "<-20dB")
          color = '#FF0000';
        else
          color = '#FFF';
      break;
  }
	return '<span style="color:' + color + '">' + string + '</span>';
}

function round2(num)
{
	return Math.round((num + 0.00001) * 100) / 100;
}

// Konversi notasi kecepatan bit ke byte
var speed_notation = function (string)
{
    const KBYTE = 1024;
    const MBYTE = KBYTE*KBYTE;
	var spd_byte = parseInt(string);
	if (spd_byte < KBYTE)
		return spd_byte + ' B/s';
	else if (spd_byte >= KBYTE && spd_byte < MBYTE)
		return round2(spd_byte / KBYTE) + ' KB/s';
	else if (spd_byte >= MBYTE)
		return round2(spd_byte / MBYTE) + ' MB/s';
}

// Stop pemanggilan GetPLMN() karena telah fungsi ini akan dipanggil dalam getIconStatus() yang akan di-override dibawah
window.GetPLMN = function () {
    return false;
}

// Override changeTooltipContent() [main.js]. Perubahan bentuk tooltip pada simbol-simbol status pada header.
window.changeTooltipContent = function () {
    $('.qtip-content').css({'text-align' : 'right', 'background-color' : '#000', 'color' : '#FFF'});  
    $('.qtip-sim').find('.qtip-content').html(STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state);
    $('.qtip-station').find('.qtip-content').html('<b>' +
        STATUS_BAR_ICON_STATUS.station_tooltip_state + '</b>');
    $('.qtip-wan').find('.qtip-content').html(STATUS_BAR_ICON_STATUS.wan_tooltip_state);
    $('.qtip-wifi').find('.qtip-content').html('<b>' +
        STATUS_BAR_ICON_STATUS.wifi_tooltip_state + '</b>');
    $('.qtip-battery').find('.qtip-content').html(STATUS_BAR_ICON_STATUS.battery_tooltip_state);
    $('.qtip-indoor').find('.qtip-content').html('<b>' +
        STATUS_BAR_ICON_STATUS.wifi_indoor_tooltip_state + '</b>');
    $('.qtip-sms').find('.qtip-content').html('<b>' +
        STATUS_BAR_ICON_STATUS.unread_sms_tooltip_state + '</b>');
    $('.rook_ext_info_title').css({'font-weight':'bold','margin-bottom':'0.25em'});
    $('.rook_ext_info').css({'margin-bottom':'0.44em', 'border-right': '2px solid #fff', 'padding-right' : '0.33em'});
}

// Override setting_dialup_showPlmnList() [mobilenetworksettings.js]. Tambahan MCC/MNC pada pemilihan jaringan manual.
window.setting_dialup_showPlmnList = function (plmnList) {
    closeWaitingDialog();
    call_dialog(setting_label_listing_network, "<table id='plmn_list' class='plmn_list'></table>", common_ok, 'pop_OK', common_cancel, 'pop_Cancel');
    var plmn_li_list =[];

    if (plmnList.length > 0) {
        button_enable('pop_OK', '0');
        var ifChecked = '';
        $.each(plmnList, function(n, value) {
            var plmnState = null;
            switch (value.State) {
                case PLMN_USABLE:
                    plmnState = plmn_label_usable;
                    break;

                case PLMN_REGISTERED:
                    plmnState = plmn_label_registered;
                    break;

                case PLMN_FORBIDDEN:
                    plmnState = plmn_label_forbidden;
                    break;

                default:
                    plmnState = common_unknown;
                    break;
            }
            if (plmnState == plmn_label_registered) {
                ifChecked = 'checked';
                button_enable('pop_OK', '1');
            } else {
                ifChecked = '';
            }
            var net_mode;
            switch(parseInt(value.Rat,10)) {
                case SETTING_DIALUP_RAT_2G:
                    net_mode = plmn_label_2g;
                    break;
                case SETTING_DIALUP_RAT_3G:
                    net_mode = plmn_label_3g;
                    break;
                case SETTING_DIALUP_RAT_4G:
                    net_mode = plmn_label_4g;
                    break;
                default:
                    break;
            }
            plmn_li_list += "<tr height = '35'><td ><input type = 'radio' name='netMode' value = '" + n + "' " + ifChecked + " id='netMode_" + n + "'></td>" +
            "<td ><label for = 'netMode_" + n + "' >" +
            XSSResolveCannotParseChar(value.ShortName) + ' <' + XSSResolveCannotParseChar(value.Numeric) + '> ' +
            net_mode + '</label><span>' + '&nbsp;' +
            ' (' + plmnState + ')' +
            '</span></td></tr>';
        });
        $('#pop_OK').bind('click', function() {
            if (!isButtonEnable('pop_OK')) {
                return;
            }
            $('#div_wrapper,.dialog').hide();
            var index = $('#plmn_list :checked').val();
            setting_dialup_setNetMode(plmnList[index].Numeric, plmnList[index].Rat);
            setting_dialup_searchAndRegister(null);
        });
    } else {
        plmn_li_list = '<tr><td>' + setting_label_no_network + '</td></tr>';
        $('#pop_Cancel').hide();
        $('#pop_OK').bind('click', function() {
            if (!isButtonEnable('pop_OK')) {
                return;
            }
            $('#div_wrapper,.dialog').hide();
            startLogoutTimer();
            g_myInitVar.getRegister();
        });
        transactionEnd();
    }
    $('#plmn_list').append(plmn_li_list);
    $('#pop_Cancel,.dialog_close_btn').bind('click', function() {
        $('#div_wrapper,.dialog').hide();
        transactionEnd();
        startLogoutTimer();
    });
    $(":radio").bind('click', function() {
        button_enable('pop_OK', '1');
    });
    reputPosition($('#sms_dialog'), $('#div_wrapper'));
}


// Override changeTooltipContent() [main.js]. Perubahan konten tooltip pada header. Penambahan info tambahan seperti kekuatan sinyal, kecepatan up/download, dan persentase baterai
window.getIconStatus = function () {
    alreadyStatusListnerExecuted = '0';
    var g_connection_status = "0";
    var header_ret = G_MonitoringStatus;
    var station_ret = G_StationStatus;
    var g_cradle_change_status = '0';

    if (header_ret !== null && header_ret.type == 'response') {
        header_icon_status.ConnectionStatus = header_ret.response.ConnectionStatus;

        if (g_module.cradle_enabled && checkValueIsNull(
                G_cradleStationStatus) && CRADLE_NETLINE_EXIST ==
            G_cradleStationStatus.cradlestatus && ETHERNET_LAN_MODE !=
            G_cradleStationStatus.connectionmode && (CRADLEAUTOMODE !=
                G_cradleStationStatus.connectionmode)) {
            var cradle_ret = G_cradleStationStatus;
            header_icon_status.ConnectionStatus = G_cradleStationStatus.connectstatus;
        }
        /*if (header_ret.response.SignalStrength == 0) {
         header_icon_status.SignalStrength = 0;
         }
         else {
         var temp = parseInt(header_ret.response.SignalStrength, 10) / 20;
         header_icon_status.SignalStrength = (temp == 0) ? "1" : temp.toString();
         }*/

        if (typeof (header_ret.response.SignalIcon) != 'undefined' ||
            header_ret.response.SignalIcon !== null) {
            header_icon_status.SignalStrength = header_ret.response.SignalIcon;
        } else {
            header_icon_status.SignalStrength = parseInt(header_ret.response
                .SignalStrength / 20, 10).toString();
        }

        header_icon_status.BatteryStatus = header_ret.response.BatteryStatus;
        header_icon_status.BatteryLevel = header_ret.response.BatteryLevel;
        header_icon_status.BatteryPercent = header_ret.response.BatteryPercent;
        header_icon_status.SimStatus = header_ret.response.SimStatus;
        header_icon_status.WifiStatus = header_ret.response.WifiStatus;

        if (typeof (header_ret.response.CurrentNetworkTypeEx) !=
            'undefined' &&
            header_ret.response.CurrentNetworkTypeEx !== '') {
            header_icon_status.CurrentNetworkType = header_ret.response.CurrentNetworkTypeEx;
        } else {
            header_icon_status.CurrentNetworkType = header_ret.response.CurrentNetworkType;
        }
        //Battery Status
        if (($.browser.msie && ($.browser.version == '6.0')) || (
                g_BatteryStatus != header_icon_status.BatteryStatus) || (
                g_BatteryLevel != header_icon_status.BatteryLevel) || ((
                g_coulometer_status == '1') && (g_BatteryPercent !=
                header_icon_status.BatteryPercent))) {
            if (g_BatteryStatus != header_icon_status.BatteryStatus) {
                if (g_coulometer_status == '1') {
                    g_coulometer_BatteryStatus = null;
                    g_BatteryLevel = header_icon_status.BatteryLevel;
                } else {
                    g_BatteryLevel = null;
                }
                g_BatteryStatus = header_icon_status.BatteryStatus;
            }
            switch (header_icon_status.BatteryStatus) {
            case MACRO_BATTERY_STATUS_NORMAL:
                if (g_coulometer_status == '1' && (g_BatteryPercent !=
                        header_icon_status.BatteryPercent ||
                        g_coulometer_BatteryStatus !=
                        header_icon_status.BatteryStatus)) {
                    g_BatteryPercent = header_icon_status.BatteryPercent;
                    g_coulometer_BatteryStatus = header_icon_status.BatteryStatus;
                    getBatteryLevel(header_icon_status.BatteryPercent);
                } else if (($.browser.msie && ($.browser.version ==
                        '6.0')) || g_BatteryLevel != header_icon_status
                    .BatteryLevel) {
                    g_BatteryLevel = header_icon_status.BatteryLevel;
                    getBatteryLevel(header_icon_status.BatteryLevel);
                }
                $('#battery_gif').show();
                break;
            case MACRO_BATTERY_STATUS_LOW:
                if (g_coulometer_status == '1') {
                    STATUS_BAR_ICON_STATUS.battery_tooltip_state =
                        header_icon_status.BatteryPercent + '%';
                } else {
                    STATUS_BAR_ICON_STATUS.battery_tooltip_state =
                        battery_prower_low;
                }
                if (null != g_lastBatteryStatus &&
                    MACRO_BATTERY_STATUS_LOW == g_lastBatteryStatus) {
                    break;
                }
                $('#battery_gif').html(
                    "<img   src = '../res/battery_low.gif' style='padding-left:6px;'/>"
                );
                $('#battery_gif').show();
                break;
            case MACRO_BATTERY_STATUS_ELECT:
                if (g_coulometer_status == '1') {
                    STATUS_BAR_ICON_STATUS.battery_tooltip_state =
                        header_icon_status.BatteryPercent + '%';
                } else {
                    STATUS_BAR_ICON_STATUS.battery_tooltip_state =
                        battery_recharging;
                }
                if (null != g_lastBatteryStatus &&
                    MACRO_BATTERY_STATUS_ELECT == g_lastBatteryStatus) {
                    break;
                }
                $('#battery_gif').html(
                    "<img   src = '../res/battery_elect.gif' style='padding-left:6px;'/>"
                );
                $('#battery_gif').show();
                break;
            case MACRO_BATTERY_STATUS_NOBATTERY:
                $('#battery_gif').hide();
                STATUS_BAR_ICON_STATUS.battery_tooltip_state = "";
                break;
            default:
                $('#battery_gif').show();
                if (g_coulometer_status == '1') {
                    getBatteryLevel(header_icon_status.BatteryPercent);
                } else {
                    STATUS_BAR_ICON_STATUS.battery_tooltip_state =
                        common_battery;
                    $('#battery_gif').html(
                        "<img   src = '../res/battery_low.gif' style='padding-left:6px;' />"
                    );
                }
                break;
            }
			STATUS_BAR_ICON_STATUS.battery_tooltip_state = '<p class="rook_ext_info"><span class="rook_ext_info_title">' + STATUS_BAR_ICON_STATUS.battery_tooltip_state + '</span></p>';
			STATUS_BAR_ICON_STATUS.battery_tooltip_state +=
				'<p class="rook_ext_info"><span class="rook_ext_info_title">Battery Level :' + header_icon_status.BatteryPercent + '%' + '</span></p>';
            g_lastBatteryStatus = header_icon_status.BatteryStatus;
        }

        //WiFi Status
        if (($.browser.msie && ($.browser.version == '6.0')) ||
            g_WifiStatus != header_icon_status.WifiStatus) {
            g_WifiStatus = header_icon_status.WifiStatus;
            switch (header_icon_status.WifiStatus) {
            case MACRO_WIFI_OFF:
                $('#wifi_gif').html(
                    "<img onload = 'fixPNG(this)' src = '../res/wifi_" +
                    MACRO_WIFI_OFF + ".png' 0 0 no-repeat>");
                STATUS_BAR_ICON_STATUS.wifi_tooltip_state =
                    wlan_label_wlan_off;
                break;
            case MACRO_WIFI_ON:
                if (typeof (G_MonitoringStatus.response.wififrequence) !=
                    undefined) {
                    if ((typeof (g_wifiFeatureSwitch) != 'undefined') &&
                        (WIFI5G_ON == g_wifiFeatureSwitch.wifi5g_enabled) &&
                        (G_MonitoringStatus.response.wififrequence ==
                            WIFI5G_ON)) {
                        $('#wifi_gif').html(
                            "<img onload = 'fixPNG(this)'  src = '../res/wifi_" +
                            MACRO_WIFI_5G + ".png' 0 0 no-repeat>");
                    } else {
                        $('#wifi_gif').html(
                            "<img onload = 'fixPNG(this)'  src = '../res/wifi_" +
                            MACRO_WIFI_ON + ".png' 0 0 no-repeat>");
                    }
                } else {
                    if ((typeof (g_wifiFeatureSwitch) != 'undefined') &&
                        (WIFI5G_ON == g_wifiFeatureSwitch.wifi5g_enabled) &&
                        (g_wlanInfo.WifiMode == "a/n")) {
                        $('#wifi_gif').html(
                            "<img onload = 'fixPNG(this)'  src = '../res/wifi_" +
                            MACRO_WIFI_5G + ".png' 0 0 no-repeat>");
                    } else {
                        $('#wifi_gif').html(
                            "<img onload = 'fixPNG(this)'  src = '../res/wifi_" +
                            MACRO_WIFI_ON + ".png' 0 0 no-repeat>");
                    }
                }
                STATUS_BAR_ICON_STATUS.wifi_tooltip_state =
                    wlan_label_wlan_on;
                break;
            default:
                $('#wifi_gif').html(
                    "<img onload = 'fixPNG(this)' src = '../res/wifi_" +
                    MACRO_WIFI_OFF + ".png' 0 0 no-repeat>");
                STATUS_BAR_ICON_STATUS.wifi_tooltip_state =
                    wlan_label_wlan_off;
                break;
            }
        }
        if (g_WifiStatus == header_icon_status.WifiStatus && MACRO_WIFI_ON ==
            header_icon_status.WifiStatus) {
            if (typeof (G_MonitoringStatus.response.wififrequence) !=
                'undefined') {
                if ((wifi5g_icon_flag == '-1') && (typeof (
                        g_wifiFeatureSwitch) != 'undefined') && (WIFI5G_ON ==
                        g_wifiFeatureSwitch.wifi5g_enabled) && (
                        G_MonitoringStatus.response.wififrequence ==
                        WIFI5G_ON)) {
                    $('#wifi_gif').html(
                        "<img onload = 'fixPNG(this)'  src = '../res/wifi_" +
                        MACRO_WIFI_5G + ".png' 0 0 no-repeat>");
                    wifi5g_icon_flag = 0;
                    wifion_icon_flag = -1;
                } else if ((wifion_icon_flag == '-1') && !((typeof (
                        g_wifiFeatureSwitch) != 'undefined') && (
                        WIFI5G_ON == g_wifiFeatureSwitch.wifi5g_enabled
                    ) && (G_MonitoringStatus.response.wififrequence ==
                        WIFI5G_ON))) {
                    $('#wifi_gif').html(
                        "<img onload = 'fixPNG(this)'  src = '../res/wifi_" +
                        MACRO_WIFI_ON + ".png' 0 0 no-repeat>");
                    wifion_icon_flag = 0;
                    wifi5g_icon_flag = -1;
                }
            } else {
                if ((wifi5g_icon_flag == '-1') && (typeof (
                        g_wifiFeatureSwitch) != 'undefined') && (WIFI5G_ON ==
                        g_wifiFeatureSwitch.wifi5g_enabled) && (g_wlanInfo.WifiMode ==
                        "a/n")) {
                    $('#wifi_gif').html(
                        "<img onload = 'fixPNG(this)'  src = '../res/wifi_" +
                        MACRO_WIFI_5G + ".png' 0 0 no-repeat>");
                    wifi5g_icon_flag = 0;
                    wifion_icon_flag = -1;
                } else if (wifion_icon_flag == '-1' && !((typeof (
                        g_wifiFeatureSwitch) != 'undefined') && (
                        WIFI5G_ON == g_wifiFeatureSwitch.wifi5g_enabled
                    ) && (g_wlanInfo.WifiMode == "a/n"))) {
                    $('#wifi_gif').html(
                        "<img onload = 'fixPNG(this)'  src = '../res/wifi_" +
                        MACRO_WIFI_ON + ".png' 0 0 no-repeat>");
                    wifion_icon_flag = 0;
                    wifi5g_icon_flag = -1;
                }
            }
            STATUS_BAR_ICON_STATUS.wifi_tooltip_state = wlan_label_wlan_on;
        }

        //wifi indoor
        if (WIFI5G_ON == g_wifiFeatureSwitch.wifi5g_enabled && typeof (
                header_ret.response.wifiindooronly) != 'undefined') {
            if (g_WifiIndoorStatus != header_ret.response.wifiindooronly ||
                ($.browser.msie && ($.browser.version == '6.0'))) {
                g_WifiIndoorStatus = header_ret.response.wifiindooronly;
                if (1 == header_ret.response.wifiindooronly) {

                    $('#indoor_gif').html(
                        "<img onload = 'fixPNG(this)'  src = '../res/wifi_indoor.png' 0 0 no-repeat>"
                    );
                    STATUS_BAR_ICON_STATUS.wifi_indoor_tooltip_state =
                        wlan_label_5gWifi_indoor;
                    $('#indoor_gif').show();
                } else {
                    $('#indoor_gif').hide();
                }
            }
        } else {
            $('#indoor_gif').hide();
        }

        //sim card or signal Status
        if ((g_SimStatus != g_main_convergedStatus.SimState) || (
                g_hSimStatus != header_icon_status.SimStatus)) {
            g_SimStatus = g_main_convergedStatus.SimState;
            g_hSimStatus = header_icon_status.SimStatus;
            sign_enable = 0;
            if (MACRO_PIN_REQUIRED == g_main_convergedStatus.SimState) { //删除了padding-top:7px后，页面tool工具条上的sim_disable.png与其他图标平齐------by ggi
                $('#sim_signal_gif').html(
                    "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/sim_disable.png ' 0 0 no-repeat>"
                );
                STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state =
                    dialup_label_pin_code_required;
            } else if (MACRO_PUK_REQUIRED == g_main_convergedStatus.SimState) {
                if (PUK_TIMES_ZERO == g_pin_status_SimPukTimes) {
                    $('#sim_signal_gif').html(
                        "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/sim_disable.png ' 0 0 no-repeat>"
                    );
                    STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state =
                        dialup_help_puk_locked;
                } else {
                    $('#sim_signal_gif').html(
                        "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/sim_disable.png ' 0 0 no-repeat>"
                    );
                    STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state =
                        dialup_label_puk_code_required;
                }
            } else if ((MACRO_SIM_STATUS_USIM_N == header_icon_status.SimStatus) ||
                (MACRO_SIM_STATUS_USIM_NE == header_icon_status.SimStatus)) {
                $('#sim_signal_gif').html(
                    "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/sim_disable.png ' 0 0 no-repeat>"
                );
                STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state =
                    dialup_label_sim_invalid;
            } else if ('undefined' == header_icon_status.SimStatus) {
                $('#sim_signal_gif').html(
                    "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/sim_disable.png ' 0 0 no-repeat>"
                );
                STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state =
                    dialup_label_sim_invalid;
            } else if (header_icon_status.SimlockStatus) {
                $('#sim_signal_gif').html(
                    "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/sim_disable.png ' 0 0 no-repeat>"
                );
                STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state =
                    dialup_label_sim_invalid;
            } else {
                sign_enable = 1;
            }
        }

        if (sign_enable) {
            getAjaxData('api/device/signal', function ($xml) {
                var signal_ret = xml2object($xml);
                if ('response' == signal_ret.type) {
                    STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state =
                        '<p class="rook_ext_info"><span class="rook_ext_info_title">Mode</span><br>' + g_net_mode + '</p>';
                    STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state +=
                        '<p class="rook_ext_info"><span class="rook_ext_info_title">PCI</span><br>' + signal_ret.response.pci + '</p>';
                    STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state +=
                        '<p class="rook_ext_info"><span class="rook_ext_info_title">Cell ID</span><br>' + signal_ret.response.cell_id + '</p>';
                    STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state +=
                        '<p class="rook_ext_info"><span class="rook_ext_info_title">SINR</span><br>' + signal_strength_colorize('sinr',signal_ret.response.sinr) + '</p>';
                    STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state +=
                        '<p class="rook_ext_info"><span class="rook_ext_info_title">RSRP</span><br>' + signal_strength_colorize('rsrp',signal_ret.response.rsrp) + '</p>';
                    STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state +=
                        '<p class="rook_ext_info"><span class="rook_ext_info_title">RSRQ</span><br>' + signal_strength_colorize('rsrq',signal_ret.response.rsrq) + '</p>';
                    STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state +=
                        '<p class="rook_ext_info"><span class="rook_ext_info_title">RSSI</span><br>' + signal_strength_colorize('rssi',signal_ret.response.rssi) + '</p>';
                }
            });
            if (($.browser.msie && ($.browser.version == '6.0')) ||
                g_SignalStrength != header_icon_status.SignalStrength && (
                    SIMCARD_OK == sign_enable)) {
                //sign_enable is used to handle simcard status change with same signal.
                g_SignalStrength = header_icon_status.SignalStrength;
                switch (header_icon_status.SignalStrength) {
                case MACRO_EVDO_LEVEL_ONE:
                case MACRO_EVDO_LEVEL_TWO:
                case MACRO_EVDO_LEVEL_THREE:
                    $('#sim_signal_gif').html(
                        "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/signal_" +
                        header_icon_status.SignalStrength +
                        ".png'0 0 no-repeat>");
                    break;

                case MACRO_EVDO_LEVEL_FOUR:
                case MACRO_EVDO_LEVEL_FIVE:
                    $('#sim_signal_gif').html(
                        "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/signal_" +
                        header_icon_status.SignalStrength +
                        ".png'0 0 no-repeat>");
                    break;
                default:
                    $('#sim_signal_gif').html(
                        "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wan_no.png'0 0 no-repeat>"
                    );
                    break;
                }
            }
            if (g_module.local_update_enabled) {
                $('#menu_update a').attr("href", "update.html");
            }
        } else {
            if (g_module.local_update_enabled &&
                !((G_MonitoringStatus.response.WifiConnectionStatus ==
                        WIFI_CONNECTED) ||
                    (g_module.cradle_enabled && checkValueIsNull(
                            G_cradleStationStatus) && CRADLE_NETLINE_EXIST ==
                        G_cradleStationStatus.cradlestatus &&
                        G_cradleStationStatus.connectionmode !=
                        ETHERNET_LAN_MODE &&
                        (G_cradleStationStatus.connectstatus !=
                            CRADLE_CONNECTSTATUSNULL &&
                            G_cradleStationStatus.connectstatus !=
                            CRANDLE_CONNECTSTATUSERRO)))) {
                $('#menu_update a').attr("href", "update_local.html");
            }
        }
    }

    //update Status
    if (g_module.online_update_enabled) {
        if (g_NotificationsOnlineUpdateStatus != G_NotificationsStatus.OnlineUpdateStatus) {
            g_NotificationsOnlineUpdateStatus = G_NotificationsStatus.OnlineUpdateStatus;
            if (G_NotificationsStatus.OnlineUpdateStatus ==
                MACRO_NEWVERSIONFOUND || G_NotificationsStatus.OnlineUpdateStatus ==
                MACRO_READYTOUPDATE) {
                $('#update_gif').css({
                    'display': 'block'
                });
                $('#tooltip_update').html(
                    "<img src = '../res/update_enable.gif'>");
            } else {
                $('#update_gif').css({
                    'display': 'none'
                });
                $('#tooltip_update').html(
                    "<img src = '../res/update_disable.gif'>");
            }
        }
    }

    function ap_station_disabled() {
        //$("#station_gif").hide();
        switch (header_icon_status.ConnectionStatus) {
        case MACRO_CONNECTION_CONNECTED:
            g_connection_status = "1";
            var CurrentUpload = '';
            var CurrentDownload = '';
            if (($.browser.msie && ($.browser.version == '6.0')) || $(
                    "#wan_gif").html().indexOf("wan_up.png") < 0) {
                STATUS_BAR_ICON_STATUS.wan_tooltip_state =
                    dialup_label_wan_connect;
            }
            $('#wan_gif').show();
            getAjaxData('api/monitoring/traffic-statistics', function (
                $xml) {
                var ret = xml2object($xml);
                if (ret.type == 'response') {
                    CurrentUpload = ret.response.CurrentUpload;
                    CurrentDownload = ret.response.CurrentDownload;
                    CurrentUploadRate = ret.response.CurrentUploadRate;
                    CurrentDownloadRate = ret.response.CurrentDownloadRate;
                    if ((wanUpload != '') && (wanUpload != null) &&
                        (wanDownload != '') && (wanDownload !=
                            null)) {
                        if ((wanUpload != CurrentUpload) && (
                                CurrentDownload == wanDownload)) {
                            if (g_up_connection_status == "0") {

                                //alert(1);
                                $('#wan_gif').html(
                                    "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wan_up.png' 0 0 no-repeat>"
                                );


                                g_disable_connection_status =
                                    "0";
                                g_up_down_connection_status =
                                    "0";
                                g_up_connection_status = "1";
                                g_down_connection_status = "0";
                            }
                            STATUS_BAR_ICON_STATUS.wan_tooltip_state = 
                                dialup_label_wan_connect;
                        } else if ((wanUpload == CurrentUpload) &&
                            (CurrentDownload != wanDownload)) {
                            if (g_down_connection_status == "0") {
                                //$('#wan_gif').html("<img onload = 'fixPNG(this)' style='padding-left:4px;padding-top:6px;padding-right:4px;' src = '../res/wan_down.png' 0 0 no-repeat>");


                                getAjaxData(
                                    'api/monitoring/status',
                                    function ($xml) {
                                        var ret =
                                            xml2object($xml);
                                        if (ret.type ==
                                            'response') {
                                            if (ret.response
                                                .WifiConnectionStatus ==
                                                "901") {
                                                $(
                                                    '#plmn_gif'
                                                ).text(
                                                    g_stationInformation
                                                    .NetworkName
                                                );
                                                $(
                                                    '#wan_gif'
                                                ).html(
                                                    "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wifi_up.png' 0 0 no-repeat>"
                                                );

                                            } else {
                                                $(
                                                    '#wan_gif'
                                                ).html(
                                                    "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wan_down.png' 0 0 no-repeat>"
                                                );
                                            }
                                        }
                                    }, {
                                        sync: true
                                    });


                                g_disable_connection_status =
                                    "0";
                                g_up_down_connection_status =
                                    "0";
                                g_up_connection_status = "0";
                                g_down_connection_status = "1";
                            }
                            STATUS_BAR_ICON_STATUS.wan_tooltip_state =
                                dialup_label_wan_connect;
                        } else if ((wanUpload != CurrentUpload) &&
                            (CurrentDownload != wanDownload)) {
                            if (g_up_down_connection_status ==
                                "0") {
                                $('#wan_gif').html(
                                    "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wan_up_down.png' 0 0 no-repeat>"
                                );

                                //alert(8);
                                //                                     
                                g_disable_connection_status =
                                    "0";
                                g_up_down_connection_status =
                                    "1";
                                g_up_connection_status = "0";
                                g_down_connection_status = "0";
                            }
                            STATUS_BAR_ICON_STATUS.wan_tooltip_state =
                                dialup_label_wan_connect;

                        } else if ((wanUpload == CurrentUpload) &&
                            (CurrentDownload == wanDownload)) {
                            if (g_disable_connection_status ==
                                "0") {
                                $('#wan_gif').html(
                                    "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wan_up.png' 0 0 no-repeat>"
                                );
                                //alert(2);

                                g_disable_connection_status =
                                    "1";
                                g_up_connection_status = "0";
                                g_down_connection_status = "0";
                                g_up_down_connection_status =
                                    "0";
                            }
                        }
                        wanUpload = CurrentUpload;
                        wanDownload = CurrentDownload;
                    } else {
                        if (g_disable_connection_status == "0") {
                            $('#wan_gif').html(
                                "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wan_up.png' 0 0 no-repeat>"
                            );

                            //alert(3);


                            g_disable_connection_status = "1";
                            g_up_connection_status = "0";
                            g_down_connection_status = "0";
                            g_up_down_connection_status = "0";
                        }
                        wanUpload = CurrentUpload;
                        wanDownload = CurrentDownload;
                    }
                    STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_connect;
                    STATUS_BAR_ICON_STATUS.wan_tooltip_state = '<p class="rook_ext_info"><span class="rook_ext_info_title">' + STATUS_BAR_ICON_STATUS.wan_tooltip_state + '</span></p>';
                    STATUS_BAR_ICON_STATUS.wan_tooltip_state +=
                        '<p class="rook_ext_info"><span class="rook_ext_info_title">Download Rate</span><br>' + speed_notation(CurrentDownloadRate) + '</p>';
                    STATUS_BAR_ICON_STATUS.wan_tooltip_state +=
                        '<p class="rook_ext_info"><span class="rook_ext_info_title">Upload Rate</span><br>' + speed_notation(CurrentUploadRate) + '</p>';
                }
            });
            break;
        default:
            STATUS_BAR_ICON_STATUS.wan_tooltip_state =
                '<p class="rook_ext_info"><span class="rook_ext_info_title">' + dialup_label_wan_disconnect + '</span></p>';
            break;
        }
    }

    //station
    if (WIFI_CONNECTED == G_MonitoringStatus.response.WifiConnectionStatus &&
        g_module.wifioffload_enable) {
        if (station_ret != null && station_ret.type == "response") {
            g_connection_status = "1";
            var wifiCurrentUpload = '';
            var wifiCurrentDownload = '';
            if (($.browser.msie && ($.browser.version == '6.0')) || $(
                    "#wan_gif").html().indexOf("wan_up.png") < 0) {
                STATUS_BAR_ICON_STATUS.wan_tooltip_state =
                    dialup_label_wan_connect;
            }
            $('#wan_gif').show();
            getAjaxData('api/wlan/station-information', function ($xml) {
                var ret = xml2object($xml);
                if (ret.type == 'response') {
                    wifiCurrentUpload = ret.response.TxFlux;
                    wifiCurrentDownload = ret.response.RxFlux;
                    if ((wifiUpload != '') && (wifiDownload != '')) {
                        if ((wifiUpload != wifiCurrentUpload) && (
                                wifiCurrentDownload == wifiDownload
                            )) {
                            if (g_up_connection_status == "0") {
                                $('#wan_gif').html(
                                    "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wifi_up.png' 0 0 no-repeat>"
                                );

                                //alert(4);


                                g_disable_connection_status = "0";
                                g_up_down_connection_status = "0";
                                g_up_connection_status = "1";
                                g_down_connection_status = "0";
                            }
                            STATUS_BAR_ICON_STATUS.wan_tooltip_state =
                                dialup_label_wan_connect;
                        } else if ((wifiUpload == wifiCurrentUpload) &&
                            (wifiCurrentDownload != wifiDownload)) {
                            if (g_down_connection_status == "0") {
                                // $('#wan_gif').html("<img onload = 'fixPNG(this)' src = '../res/wan_down.png' 0 0 no-repeat>");


                                getAjaxData('api/monitoring/status',
                                    function ($xml) {
                                        var ret = xml2object(
                                            $xml);
                                        if (ret.type ==
                                            'response') {
                                            if (ret.response.WifiConnectionStatus ==
                                                "901") {
                                                $('#plmn_gif').text(
                                                    g_stationInformation
                                                    .NetworkName
                                                );
                                                $('#wan_gif').html(
                                                    "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wifi_up.png' 0 0 no-repeat>"
                                                );

                                            } else {
                                                $('#wan_gif').html(
                                                    "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wan_down.png' 0 0 no-repeat>"
                                                );
                                            }
                                        }
                                    }, {
                                        sync: true
                                    });


                                g_disable_connection_status = "0";
                                g_up_down_connection_status = "0";
                                g_up_connection_status = "0";
                                g_down_connection_status = "1";
                            }
                            STATUS_BAR_ICON_STATUS.wan_tooltip_state =
                                dialup_label_wan_connect;
                        } else if ((wifiUpload != wifiCurrentUpload) &&
                            (wifiCurrentDownload != wifiDownload)) {
                            if (g_up_down_connection_status == "0") {
                                // $("#wan_gif").html("<img onload = 'fixPNG(this)' src = '../res/wan_up_down.png' 0 0 no-repeat>");

                                getAjaxData('api/monitoring/status',
                                    function ($xml) {
                                        var ret = xml2object(
                                            $xml);
                                        if (ret.type ==
                                            'response') {
                                            if (ret.response.WifiConnectionStatus ==
                                                "901") {
                                                $('#plmn_gif').text(
                                                    g_stationInformation
                                                    .NetworkName
                                                );
                                                $('#wan_gif').html(
                                                    "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wifi_up.png' 0 0 no-repeat>"
                                                );

                                            } else {
                                                $('#wan_gif').html(
                                                    "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wan_up_down.png' 0 0 no-repeat>"
                                                );
                                            }
                                        }
                                    }, {
                                        sync: true
                                    });

                                g_up_down_connection_status = "1";
                                g_disable_connection_status = "0";
                                g_up_connection_status = "0";
                                g_down_connection_status = "0";
                            }
                            STATUS_BAR_ICON_STATUS.wan_tooltip_state =
                                dialup_label_wan_connect;
                        } else if ((wifiUpload == wifiCurrentUpload) &&
                            (wifiCurrentDownload == wifiDownload)) {
                            if (g_disable_connection_status == "0") {
                                //$('#wan_gif').html("<img onload = 'fixPNG(this)' src = '../res/wan_up.png' 0 0 no-repeat>");
                                ///wifi
                                getAjaxData('api/monitoring/status',
                                    function ($xml) {
                                        var ret = xml2object(
                                            $xml);
                                        if (ret.type ==
                                            'response') {
                                            if (ret.response.WifiConnectionStatus ==
                                                "901") {

                                                $('#wan_gif').html(
                                                    "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wifi_up.png' 0 0 no-repeat>"
                                                );
                                                $('#plmn_gif').text(
                                                    g_stationInformation
                                                    .NetworkName
                                                );
                                            } else {
                                                $('#wan_gif').html(
                                                    "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wan_up.png' 0 0 no-repeat>"
                                                );
                                            }
                                        }
                                    }, {
                                        sync: true
                                    });
                                ///wifi



                                //alert(5);

                                g_disable_connection_status = "1";
                                g_up_down_connection_status = "0";
                                g_up_connection_status = "0";
                                g_down_connection_status = "0";
                            }
                        }
                        wifiUpload = wifiCurrentUpload;
                        wifiDownload = wifiCurrentDownload;
                    } else {
                        if (g_disable_connection_status == "0") {
                            // $('#wan_gif').html("<img onload = 'fixPNG(this)' src = '../res/wan_up.png' 0 0 no-repeat>");

                            //wifi
                            getAjaxData('api/monitoring/status',
                                function ($xml) {
                                    var ret = xml2object($xml);
                                    if (ret.type == 'response') {
                                        if (ret.response.WifiConnectionStatus ==
                                            "901") {
                                            $('#plmn_gif').text(
                                                g_stationInformation
                                                .NetworkName
                                            );
                                            $('#wan_gif').html(
                                                "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wifi_up.png' 0 0 no-repeat>"
                                            );

                                        } else {
                                            $('#wan_gif').html(
                                                "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wan_up.png' 0 0 no-repeat>"
                                            );
                                        }
                                    }
                                }, {
                                    sync: true
                                });

                            //wifi

                            //alert(6);


                            g_disable_connection_status = "1";
                            g_up_down_connection_status = "0";
                            g_up_connection_status = "0";
                            g_down_connection_status = "0";
                        }
                        wifiUpload = wifiCurrentUpload;
                        wifiDownload = wifiCurrentDownload;
                    }
                }
            });
            var apSignal = setWifiSignal(station_ret.response.SignalStrength);
            if (($.browser.msie && ($.browser.version == '6.0')) || typeof (
                    $("#station_gif").html()) == "undefined" || $(
                    "#station_gif").html().indexOf("station_" + apSignal +
                    ".png") < 0) {
                $("#station_gif").html(
                    "<img onload = 'fixPNG(this)' src = '../res/station_" +
                    apSignal + ".png' 0 0 no-repeat>");
            }
            $("#station_gif").show();
            //zhouqi
            // $('#wan_gif').html("<img onload = 'fixPNG(this)' style='padding-left:4px;' src = '../res/wan_no.png' 0 0 no-repeat>");
            zq_4g_show = false;

        } else {
            /*$("#station_gif").css({background:"url(../res/station_0.gif) 0 0 no-repeat"});
             STATUS_BAR_ICON_STATUS.station_tooltip_state = common_sig_off;
             ap_station_disabled();*/
            $("#station_gif").hide();
            zq_4g_show = true;
            ap_station_disabled();
        }
        g_Monitoring_CradleConnectionStatus = -1111;
        $('#internet').show();
    } else if (g_module.cradle_enabled && checkValueIsNull(
            G_cradleStationStatus) && CRADLE_NETLINE_EXIST ==
        G_cradleStationStatus.cradlestatus && ETHERNET_LAN_MODE !=
        G_cradleStationStatus.connectionmode && (CRADLEAUTOMODE !=
            G_cradleStationStatus.connectionmode)) {
        if (($.browser.msie && ($.browser.version == '6.0')) ||
            g_Monitoring_CradleConnectionStatus != G_cradleStationStatus.cradlestatus
        ) {
            g_Monitoring_CradleConnectionStatus = G_cradleStationStatus.cradlestatus;
            $('#station_gif').html(
                "<img onload = 'fixPNG(this)' src = '../res/cradle_1.png' 0 0 no-repeat>"
            );
            $("#station_gif").show();

            //  $('#wan_gif').html("<img onload = 'fixPNG(this)' style='padding-left:4px;' src = '../res/wan_no.png' 0 0 no-repeat>");
            zq_4g_show = false;
            STATUS_BAR_ICON_STATUS.station_tooltip_state =
                IDS_plmn_label_wx;
            g_cradle_change_status = '1';
            if (G_cradleStationStatus.connectstatus == CRADLE_CONNECTED) {
                g_connection_status = "1";
                $('#wan_gif').show();
                if (g_up_down_connection_status == "0") {
                    $("#wan_gif").html(
                        "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wan_up_down.png' 0 0 no-repeat>"
                    );
                    g_up_down_connection_status = "1";
                    g_disable_connection_status = "0";
                    g_up_connection_status = "0";
                    g_down_connection_status = "0";
                }
                STATUS_BAR_ICON_STATUS.wan_tooltip_state =
                    dialup_label_wan_connect;
            } else {
                ap_station_disabled();
                $('#internet').show();
            }
        } else {
            if (checkValueIsNull(G_cradleStationStatus) &&
                G_cradleStationStatus.connectstatus == CRADLE_CONNECTED) {
                g_connection_status = "1";
                $('#wan_gif').show();
                if (g_up_down_connection_status == "0") {
                    $("#wan_gif").html(
                        "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wan_up_down.png' 0 0 no-repeat>"
                    );
                    g_up_down_connection_status = "1";
                    g_disable_connection_status = "0";
                    g_up_connection_status = "0";
                    g_down_connection_status = "0";
                }
                STATUS_BAR_ICON_STATUS.wan_tooltip_state =
                    dialup_label_wan_connect;
            }
            g_Monitoring_CradleConnectionStatus = G_cradleStationStatus.cradlestatus;
        }

    } else {
        g_Monitoring_CradleConnectionStatus = -1111;
        $("#station_gif").hide();
        zq_4g_show = true;
        ap_station_disabled();
        $('#internet').show();
    }
    if (G_cradleStationStatus != null) {
        if (g_module.cradle_enabled && (G_cradleStationStatus.cradlestatus ==
                1) && (G_cradleStationStatus.connectionmode == 0 ||
                G_cradleStationStatus.connectionmode == 1) && (
                g_cradle_change_status == '0')) {
            if (G_cradleStationStatus.connectstatus == CRADLE_CONNECTFAILED) {
                $('#station_gif').html(
                    "<img onload = 'fixPNG(this)' src = '../res/cradle_1.png' 0 0 no-repeat>"
                );
            } else {
                $('#station_gif').html(
                    "<img onload = 'fixPNG(this)' src = '../res/cradle_twinkle.gif' 0 0 no-repeat>"
                );
                g_Monitoring_CradleConnectionStatus = -1111;
            }
            $("#station_gif").show();
            //  $('#wan_gif').html("<img onload = 'fixPNG(this)' style='padding-left:4px;' src = '../res/wan_no.png' 0 0 no-repeat>");
            zq_4g_show = false;
            STATUS_BAR_ICON_STATUS.station_tooltip_state =
                IDS_plmn_label_wx;
        }
    }
    if (g_connection_status == "0") {
        $("#wan_gif").hide();
        //$("#wan_gif").html("<img onload = 'fixPNG(this)' src = '../res/wan_no.png' 0 0 no-repeat>");

    }
    //unread sms
    var unreadSmsSize = G_NotificationsStatus.UnreadMessage;
    STATUS_BAR_ICON_STATUS.unread_sms_tooltip_state = common_new_message +
        unreadSmsSize;
    // changeTooltipContent();

    var plmn_name = '';
    var connect_type = '';
    if (typeof (G_MonitoringStatus.response.CurrentNetworkTypeEx) !=
        'undefined' &&
        G_MonitoringStatus.response.CurrentNetworkTypeEx != '') {
        connect_type = G_MonitoringStatus.response.CurrentNetworkTypeEx;
    } else {
        connect_type = G_MonitoringStatus.response.CurrentNetworkType;
    }
    if (!(connect_type == CURRENT_NETWORK_NO_SERVICE ||
            G_MonitoringStatus.response.CurrentServiceDomain ==
            SERVICE_DOMAIN_NO_SERVICE ||
            G_MonitoringStatus.response.ServiceStatus !=
            SERVICE_STATUS_AVAIABLE) && (!(G_MonitoringStatus.response.WifiConnectionStatus ==
            WIFI_CONNECTED ||
            (g_module.cradle_enabled && G_cradleStationStatus.cradlestatus ==
                CRADLE_NETLINE_EXIST && G_cradleStationStatus.connectionmode !=
                CRADLELANONLY && (CRADLEAUTOMODE !=
                    G_cradleStationStatus.connectionmode))))) {
        getAjaxData('api/net/current-plmn', function ($xml) {
            var plmn_ret = xml2object($xml);
            if ('response' == plmn_ret.type) {
                if (null == plmn_ret ||
                    '' == plmn_ret.response.State ||
                    ' ' == plmn_ret.response.State ||
                    null == plmn_ret.response.State) {
                    plmn_name = '';
                } else {
                    if ((typeof (plmn_ret.response.ShortName) !=
                            'undefined' &&
                            plmn_ret.response.ShortName.length > 0) &&
                        typeof (plmn_ret.response.Numeric) !=
                        'undefined') {

                        plmn_name = plmn_ret.response.ShortName;
                        plmn_name += ' ' + plmn_ret.response.Numeric;
                        $('#plmn_gif').text(plmn_name);
                    } else if ((typeof (plmn_ret.response.FullName) !=
                            'undefined' &&
                            plmn_ret.response.FullName.length > 0) &&
                        typeof (plmn_ret.response.Numeric) !=
                        'undefined') {

                        plmn_name = plmn_ret.response.FullName;
                        plmn_name += ' ' + plmn_ret.response.Numeric;
                        $('#plmn_gif').text(plmn_name);
                    } else if (typeof (plmn_ret.response.Numeric) !=
                        'undefined') {
                        plmn_name = plmn_ret.response.Numeric;
                        $('#plmn_gif').text(plmn_name);
                    } else {
                        plmn_name = '';
                    }
                }
                if (G_MonitoringStatus != null &&
                    typeof (G_MonitoringStatus.response) !=
                    'undefined' &&
                    parseInt(G_MonitoringStatus.response.RoamingStatus,
                        10) == 1 &&
                    parseInt(G_MonitoringStatus.response.ServiceStatus,
                        10) == SERVICE_STATUS_AVAIABLE) {
                    plmn_name += ' ';
                    plmn_name += IDS_dialup_label_roaming;
                }
                $('#plmn_gif').text(plmn_name);
            }
        });
    }
    getAjaxData("api/wlan/station-information", function ($xml) {
        var ret = xml2object($xml);
        if (ret.type == "response") {
            g_stationInformation = ret.response;
        }
    }, {
        sync: true
    });
    var rat = '';
    if (navigator.userAgent.indexOf("Firefox") != -1) {

        getAjaxData('api/monitoring/status', function ($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                if (ret.response.WifiConnectionStatus == "901") {
                    $('#plmn_gif').text(g_stationInformation.NetworkName);
                }
            }
        }, {
            sync: true
        });
    }
    if (G_MonitoringStatus.response.WifiConnectionStatus == WIFI_CONNECTED) {
        plmn_name = g_stationInformation.NetworkName;
        $('#plmn_gif').text(plmn_name);
        $('#wan_gif').html(
            "<img onload = 'fixPNG(this)' style='padding-right:5px;' src = '../res/wifi_up.png' 0 0 no-repeat>"
        );
        rat = wlan_lable_wifi;
    } else if (g_module.cradle_enabled && (G_cradleStationStatus.cradlestatus ==
            CRADLE_NETLINE_EXIST) && G_cradleStationStatus.connectionmode !=
        CRADLELANONLY && (CRADLEAUTOMODE != G_cradleStationStatus.connectionmode)
    ) {
        $('#plmn_gif').text(IDS_plmn_label_wx);
    } else {
        if (g_plmn_rat != 'undefined' && g_plmn_rat != '') {
            //plmn Status
            rat = g_plmn_rat;
        }
    }
    $("#status_img_rat").remove();
    $('#status_img').append('<p id = "status_img_rat">' + rat + '</p>');
    changeTooltipContent();
}
