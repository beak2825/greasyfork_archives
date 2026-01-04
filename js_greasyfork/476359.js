// ==UserScript==
// @name         Compound Score for ZwiftPower
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Compound Score column for ZwiftPower.com results table
// @author       maxnk
// @match        https://zwiftpower.com/events.php?zid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zwiftpower.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476359/Compound%20Score%20for%20ZwiftPower.user.js
// @updateURL https://update.greasyfork.org/scripts/476359/Compound%20Score%20for%20ZwiftPower.meta.js
// ==/UserScript==

var cScoreAdded = false;

table_event_results_final = function (table_name, ajax_url) {
    // reinit datatable
    if ($.fn.DataTable.isDataTable('#' + table_name)) {
        $('#' + table_name).DataTable().destroy();
    }

    // add compound score column
    var cscoreHeader = $('<th class="text-right small" width="1" title=" Compound score">cScore</th>');
    $('#' + table_name + ' thead tr').find('th:last').before(cscoreHeader);

    // reinit column selector
    zwiftpower_functions[table_name + '_colvis'] = false;

    ZP_VARS.zwift_id_list = [];
    if (typeof (ajax_url) == 'undefined') {
        ajax_url = "cache3/results/" + ZP_VARS.zwift_event_id + "_view.json";
        if (typeof (ZP_VARS.files['event_results_view_' + ZP_VARS.zwift_event_id]) !== 'undefined')
            ajax_url = "cache3/results/event_results_view" + ZP_VARS.zwift_event_id + ZP_VARS.files['event_results_view_' + ZP_VARS.zwift_event_id] + '.json'
    }

    buildColumnChooser(table_name);
    table[table_name] = $('#' + table_name).DataTable({
        "ajax": {
            "url": ajax_url, dataSrc: function (json) {
                if (json.data.length) {
                    $("#final_results").html(' (' + json.data.length + ') ');
                    if (ZP_VARS.waiting_for_new > 0)
                        $("#final_results").fadeIn(1000).fadeOut(1000).fadeIn(1000).fadeOut(1000).fadeIn(1000).fadeOut(1000).fadeIn(1000)
                }
                if (json.fname && ZP_VARS.hash[json.fname] !== 'undefined') {
                    var hash = ZP_VARS.hash[json.fname];
                    if (hash && typeof (json.P2) !== 'undefined') {
                        let decrypted = CryptoJS.AES.decrypt(JSON.stringify(json.P2), hash, {format: CryptoJSAesJson}).toString(CryptoJS.enc.Utf8)
                        let final = JSON.parse(decrypted);
                        json.data.forEach(function (item, index) {
                            for (group in final)
                                json.data[index][group] = final[group][json.data[index][group]]
                        })
                    }
                }
                return json.data
            },
        },
        "columns": [{
            data: "pos",
            render: ZP_DATA_get_POSITION_SIMPLE,
            className: 'text-left text-nowrap',
            visible: !1,
        }, {
            data: "pos",
            render: ZP_DATA_get_POSITION_SIMPLE,
            className: 'text-left text-nowrap',
            visible: !1,
        }, {data: "pos", render: ZP_DATA_get_POSITION_SIMPLE, className: 'text-left text-nowrap', visible: !1,}, {
            data: "category", render: function (data, type, row) {
                if (type != "display")
                    return data;
                str = '';
                var add = '';
                if (typeof (row.actid) !== 'undefined' && row.actid > 0 && row.src == 1)
                    add = '<i onclick="javascript:activity_link(\'' + row.actid + '\');return false;" class="fa fa-bar-chart fa-fw text-green hover-orange analysis_link" aria-hidden="true" title="View activity for ' + row.name + ' at Zwift.com"></i>';
                str += add + ZP_DATA_get_NEW_CATEGORY(data, type, row);
                return str
            }, className: ' info-expand text-right text-nowrap', orderable: !1,
        }, {
            data: "pos",
            render: ZP_DATA_get_POSITION,
            className: 'text-left text-nowrap',
            type: 'non-empty-string',
            orderable: !0,
        }, {data: "name", render: ZP_DATA_get_NAME, className: 'text-left text-nowrap athlete_col',}, {
            data: "time",
            render: ZP_DATA_get_TIME_WITH_GAP,
            className: 'text-right text-nowrap padright24',
            "orderSequence": ["asc", "desc"],
        }, {
            data: "lag",
            render: ZP_DATA_get_LAG,
            className: 'text-left text-nowrap',
            "orderSequence": ["desc", "asc"],
            visible: !1,
            orderable: !0,
        }, {
            data: "vtta",
            render: function (data, type, row) {
                if (type != "display")
                    return data;
                if (!data)
                    return '';
                if (!row.vttat)
                    return '';
                if (typeof (row.vttat) === 'undefined')
                    return convertSecondsToTime(data);
                return ZP_DATA_get_VTTA_TIME(row.vttat, row.vtta)
            },
            className: 'text-right text-nowrap padright24',
            "orderSequence": ["desc"],
            visible: ZP_CAN_DISPLAY_COLUMN('vtta', !1),
            type: 'non-empty-string',
        }, {
            data: "pts",
            render: ZP_DATA_get_POINTS,
            className: 'text-right text-nowrap padright24',
            "orderSequence": ["asc", "desc"],
            visible: ZP_CAN_DISPLAY_COLUMN('pts', !1),
        }, {
            data: "avg_wkg",
            render: function (data, type, row) {
                view_data = data;
                if (type != "display")
                    return view_data[0];
                if (ZP_VARS.expand_results)
                    return ZP_DATA_get_95_PERCENT(row); else return ZP_DATA_get_AVG_WKG(data, type, row)
            },
            className: 'text-right text-nowrap',
            "orderSequence": ["desc", "asc"],
            orderable: !1,
            type: 'non-empty-string',
        }, {
            data: "avg_power",
            render: function (data, type, row) {
                view_data = data;
                if (type != "display")
                    return view_data[0];
                return ZP_DATA_get_WKG_OR_WATTS(view_data, type, row)
            },
            className: 'text-right text-nowrap padright24',
            "orderSequence": ["desc", "asc"],
            type: 'non-empty-string',
        }, {
            data: "np",
            render: ZP_DATA_get_NP,
            className: 'text-right text-nowrap',
            "orderSequence": ["desc", "asc"],
            type: 'non-empty-string',
            orderable: !1,
        }, {
            data: "wkg1200",
            render: function (data, type, row) {
                view_data = data;
                if (typeof (ZP_VARS.view_power_type) !== 'undefined' && ZP_VARS.view_power_type == 1)
                    view_data = row.w1200;
                if (type != "display")
                    return view_data[0];
                if (data != view_data)
                    return ZP_DATA_get_WATTS(view_data, type, row); else return ZP_DATA_get_WKG(data, type, row)
            },
            className: 'text-right text-nowrap padright24',
            "orderSequence": ["desc", "asc"],
            type: 'non-empty-string',
        }, {
            data: "wkg300",
            render: function (data, type, row) {
                view_data = data;
                if (typeof (ZP_VARS.view_power_type) !== 'undefined' && ZP_VARS.view_power_type == 1)
                    view_data = row.w300;
                if (type != "display")
                    return view_data[0];
                if (data != view_data)
                    return ZP_DATA_get_WATTS(view_data, type, row); else return ZP_DATA_get_WKG(data, type, row)
            },
            className: 'text-right text-nowrap padright24',
            "orderSequence": ["desc", "asc"],
            type: 'non-empty-string',
        }, {
            data: "wkg120",
            render: function (data, type, row) {
                view_data = data;
                if (typeof (ZP_VARS.view_power_type) !== 'undefined' && ZP_VARS.view_power_type == 1)
                    view_data = row.w120;
                if (type != "display")
                    return view_data[0];
                if (data != view_data)
                    return ZP_DATA_get_WATTS(view_data, type, row); else return ZP_DATA_get_WKG(data, type, row)
            },
            className: 'text-right text-nowrap padright24',
            "orderSequence": ["desc", "asc"],
            type: 'non-empty-string',
            visible: !1,
        }, {
            data: "wkg60",
            render: function (data, type, row) {
                view_data = data;
                if (typeof (ZP_VARS.view_power_type) !== 'undefined' && ZP_VARS.view_power_type == 1)
                    view_data = row.w60;
                if (type != "display")
                    return view_data[0];
                if (data != view_data)
                    return ZP_DATA_get_WATTS(view_data, type, row); else return ZP_DATA_get_WKG(data, type, row)
            },
            className: 'text-right text-nowrap padright24',
            "orderSequence": ["desc", "asc"],
            type: 'non-empty-string',
            visible: ZP_CAN_DISPLAY_COLUMN_REVERSE('vtta', !0),
        }, {
            data: "wkg30",
            render: function (data, type, row) {
                view_data = data;
                if (typeof (ZP_VARS.view_power_type) !== 'undefined' && ZP_VARS.view_power_type == 1)
                    view_data = row.w30;
                if (type != "display")
                    return view_data[0];
                if (data != view_data)
                    return ZP_DATA_get_WATTS(view_data, type, row); else return ZP_DATA_get_WKG(data, type, row)
            },
            className: 'text-right text-nowrap padright24',
            "orderSequence": ["desc", "asc"],
            type: 'non-empty-string',
            visible: !0,
        }, {
            data: "wkg15",
            render: function (data, type, row) {
                view_data = data;
                if (typeof (ZP_VARS.view_power_type) !== 'undefined' && ZP_VARS.view_power_type == 1)
                    view_data = row.w15;
                if (type != "display")
                    return view_data[0];
                if (data != view_data)
                    return ZP_DATA_get_WATTS(view_data, type, row); else return ZP_DATA_get_WKG(data, type, row)
            },
            className: 'text-right text-nowrap padright24',
            "orderSequence": ["desc", "asc"],
            type: 'non-empty-string',
            visible: ZP_CAN_DISPLAY_COLUMN_REVERSE('vtta', !0),
        }, {
            data: "wkg5",
            render: function (data, type, row) {
                view_data = data;
                if (typeof (ZP_VARS.view_power_type) !== 'undefined' && ZP_VARS.view_power_type == 1)
                    view_data = row.w5;
                if (type != "display")
                    return view_data[0];
                if (data != view_data)
                    return ZP_DATA_get_WATTS(view_data, type, row); else return ZP_DATA_get_WKG(data, type, row)
            },
            className: 'text-right text-nowrap padright24',
            "orderSequence": ["desc", "asc"],
            type: 'non-empty-string',
            visible: !1,
        }, {
            data: "weight",
            render: ZP_DATA_get_WEIGHT,
            className: 'text-right text-nowrap',
            'orderable': !1,
            type: 'non-empty-string',
        },{
            data: "age",
            render: ZP_DATA_get_AGE,
            className: 'text-center text-nowrap',
            "orderSequence": [ "asc", "desc"],
            type: 'non-empty-string',

        },{
            data: "avg_hr",
            render: ZP_DATA_get_HR_MAX,
            className: 'text-right text-nowrap',
            'orderable': !1,
            type: 'non-empty-string',
        }, {
            data: "max_hr",
            render: ZP_DATA_get_HR,
            className: 'text-center text-nowrap',
            "orderSequence": ["desc", "asc"],
            type: 'non-empty-string',
        }, {
            data: "height",
            render: ZP_DATA_get_HEIGHT,
            className: 'info-expand text-right text-nowrap padright24',
            "orderSequence": ["desc", "asc"],
            type: 'non-empty-string',
        }, {
            data: "power_type",
            render: ZP_DATA_get_POWER_TYPE,
            className: 'text-center',
            type: 'non-empty-string',
            "orderable": !1,
            visible: !1,
        }, {
            data: "zwid",
            render: ZP_DATA_get_ZWID,
            visible: !1,
            className: 'text-right',
            "orderable": !1,
        }, {
            data: "skill_b",
            render: ZP_DATA_get_RANKING_EVENT_BEFORE,
            className: 'text-right text-nowrap',
            visible: !1,
            orderable: !1,
        }, {
            data: "skill",
            render: ZP_DATA_get_RANKING_EVENT,
            className: 'text-right text-nowrap',
            visible: !1,
            orderable: !1,
        }, {
            data: "skill_gain",
            render: ZP_DATA_get_RANKING_GAIN,
            className: 'text-right text-nowrap',
            visible: (ZP_VARS.RANKINGS_ACTIVE) ? !0 : !1,
            orderable: !1,
        }, {
            data: "cscore",
            render: function (data, type, row) {
                return Math.round(row.w300[0] * row.wkg300[0])
            },
            className: 'text-center text-nowrap',
            "orderSequence": ["desc", "asc"],
            type: 'non-empty-string',
        }, {
            data: "uid", render: function (data, type, row) {
                if (type != "display")
                    return data;
                if (!data)
                    return '';
                str = '';
                cp = ' <div class="pull-left"><i class="fa fa-fw text-gray hover-red " ></i></div>';
                if (row.cp > 0)
                    cp = ' <div class="pull-left"><a href="#" onClick="javascript:view_critical_power(' + row.zwid + ');return false"><i id="cp_zwift_id_' + row.zwid + '" class="fa fa-pie-chart text-gray hover-red " aria-hidden="true" title="Critical Power"></i></a></div>';
                if (row.pos == 1 && !ZP_VARS.zwift_id_list.length)
                    ZP_VARS.zwift_id_list.push(row.zwid); else if (row.zwid == ZP_VARS.zid) {
                        ZP_VARS.zwift_id_list = [];
                        ZP_VARS.zwift_id_list.push(row.zwid)
                    }
                return cp
            }, className: 'text-center', orderable: !1,
        },],
        "paging": !0,
        "sDom": "<'search_align_top2'f>rtip",
        "pageLength": 200,
        "lengthChange": !1,
        "searching": !0,
        "deferRender": !0,
        "order": [[0, "asc"]],
        "autoWidth": !1,
        "stateSave": !1,
        "oLanguage": {"sZeroRecords": "Results are generated every 30 minutes for upto 6 hours after event begins."},
        "info": !1,
        "ordering": !0,
        "initComplete": function (settings, json) {
            zwift_id_list = ZP_VARS.zwift_id_list.join(',');
            if (ZP_VARS.zwift_id_list.length)
                for (i = 0; i < ZP_VARS.zwift_id_list.length; i++)
                    $('#cp_zwift_id_' + ZP_VARS.zwift_id_list[i]).removeClass('text-gray').addClass('text-green');
            CRITICAL_POWER_URL = "api3.php?do=critical_power_event&zwift_id=" + zwift_id_list + "&zwift_event_id=" + ZP_VARS.zwift_event_id
        },
    });
    $("<div id='tooltip_bg'></div>").css({
        position: "absolute",
        display: "none",
        "text-align": "center",
        "-moz-border-radius": "5px",
        "-webkit-border-radius": "5px",
        "border-radius": "5px",
        "border": "2px solid #fff",
        padding: "3px 7px",
        "font-size": "12px",
        "color": "#fff",
        "background-color": "#fff"
    }).appendTo("body");
    $("<div id='tooltip'></div>").css({
        position: "absolute",
        display: "none",
        "text-align": "center",
        "-moz-border-radius": "5px",
        "-webkit-border-radius": "5px",
        "border-radius": "5px",
        "border": "2px solid",
        padding: "3px 7px",
        "font-size": "12px",
        "color": "#555"
    }).appendTo("body");
    updateColumnChooser(table_name);

    cScoreAdded = true;
};

$('#table_event_results_final').on('init.dt', function() {
    if (!cScoreAdded) {
        table_event_results_final('table_event_results_final');
    }
});
