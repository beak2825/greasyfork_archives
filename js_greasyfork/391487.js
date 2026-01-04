// ==UserScript==
// @name         Tron add NSE Sev12 table
// @namespace    Tron.f5.com
// @version      0.6
// @description  try to take over the world!
// @author       Yan Zhang
// @match        https://tron.f5net.com/sr/dashboard/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391487/Tron%20add%20NSE%20Sev12%20table.user.js
// @updateURL https://update.greasyfork.org/scripts/391487/Tron%20add%20NSE%20Sev12%20table.meta.js
// ==/UserScript==

var restrict = ["UNITED STATES", "UNITED KINGDOM", "AUSTRALIA", "NEW ZEALAND", "AUSTRIA", "BELGIUM", "BULGARIA", "CROATIA", "CYPRUS", "CZECH REPUBLIC", "DENMARK", "ESTONIA", "FINLAND", "FRANCE", "GERMANY", "GREECE", "HUNGARY", "IRELAND", "ITALY", "LATVIA", "LITHUANIA", "LUXEMBOURG", "MALTA", "NETHERLANDS", "POLAND", "ROMANIA", "SLOVAKIA", "SLOVENIA", "SPAIN", "SWEDEN", "CANADA"];
var apcj = ["KOREA, REPUBLIC OF","CHINA", "INDIA", "INDONESIA", "PAKISTAN", "BANGLADESH", "JAPAN", "PHILIPPINES", "VIETNAM", "THAILAND", "MYANMAR", "SOUTH KOREA", "MALAYSIA", "NEPAL", "NORTH KOREA", "AUSTRALIA", "TAIWAN", "SRI LANKA", "CAMBODIA", "PAPUA NEW GUINEA", "LAOS", "SINGAPORE", "NEW ZEALAND", "MONGOLIA", "TIMOR LESTE", "FIJI", "BHUTAN", "SOLOMON ISLANDS", "MALDIVES", "BRUNEI", "VANUATU", "NEW CALEDONIA", "FRENCH POLYNESIA", "SAMOA", "GUAM", "KIRIBATI", "MICRONESIA", "TONGA", "MARSHALL ISLANDS", "NORTHERN MARIANA ISLANDS", "PALAU", "COOK ISLANDS", "TUVALU", "WALLIS AND FUTUNA", "NAURU", "NIUE", "TOKELAU", "HONG KONG", "MACAU"];
var na = ["UNITED STATES","MEXICO","CANADA","GUATEMALA","CUBA","HAITI","DOMINICAN REPUBLIC","HONDURAS","EL SALVADOR","NICARAGUA","COSTA RICA","PANAMA","PUERTO RIC","JAMAICA","TRINIDAD AND TOBAGO","GUADELOUPE","MARTINIQUE","BAHAMAS","BELIZE","BARBADOS","SAINT LUCIA","SAINT VINCENT AND THE GRENADINES","UNITED STATES VIRGIN ISLANDS","GRENADA","ANTIGUA AND BARBUDA","DOMINICA","BERMUDA","CAYMAN ISLANDS","GREENLAND","SAINT KITTS AND NEVIS","SINT MAARTEN","TURKS AND CAICOS ISLANDS","SAINT MARTIN","BRITISH VIRGIN ISLANDS","CARIBBEAN NETHERLANDS","ANGUILLA","SAINT BARTHÉLEMY","SAINT PIERRE AND MIQUELON","MONTSERRAT","BRAZIL","COLOMBIA","ARGENTINA","PERU","VENEZUELA","CHILE","ECUADOR","BOLIVIA","PARAGUAY","URUGUAY","GUYANA","SURINAME","FRENCH GUIANA","FALKLAND ISLANDS"];
var emea = ["ALBANIA","ALGERIA","ANDORRA","ANGOLA","AUSTRIA","BAHRAIN","BELARUS","BELGIUM","BENIN","BOSNIA AND HERZEGOVINA","BOTSWANA","BULGARIA","BURKINA FASO","BURUNDI","CAMEROON","CAPE VERDE","CENTRAL AFRICAN REPUBLIC","CHAD","COMOROS","CROATIA","CYPRUS","CZECH REPUBLIC","DEMOCRATIC REPUBLIC OF THE CONGO","DENMARK","DJIBOUTI","EGYPT","EQUATORIAL GUINEA","ERITREA","ESTONIA","ETHIOPIA","FAROE ISLANDS","FINLAND","FRANCE","GABON","GAMBIA","GEORGIA","GERMANY","GHANA","GIBRALTAR","GREECE","GUERNSEY","GUINEA","GUINEA-BISSAU","HUNGARY","ICELAND","IRAN","IRAQ","IRELAND","ISLE OF MAN","ISRAEL","ITALY","IVORY COAST","JERSEY","JORDAN","KENYA","KUWAIT","LATVIA","LEBANON","LESOTHO","LIBERIA","LIBYA","LIECHTENSTEIN","LITHUANIA","LUXEMBOURG","MACEDONIA","MADAGASCAR","MALAWI","MALI","MALTA","MAURITANIA","MAURITIUS","MOLDOVA","MONACO","MONTENEGRO","MOROCCO","MOZAMBIQUE","NAMIBIA","NETHERLANDS","NIGER","NIGERIA","NORWAY","OMAN","PALESTINE","POLAND","PORTUGAL","QATAR","ROMANIA","RWANDA","SAN MARINO","SAO TOME & PRINCIPE","SAUDI ARABIA","SENEGAL","SERBIA","SLOVAKIA","SLOVENIA","SOMALIA","SOUTH AFRICA","SPAIN","SUDAN","SWAZILAND","SWEDEN","SWITZERLAND","SYRIA","TANZANIA","TOGO","TUNISIA","TURKEY","UGANDA","UKRAINE","UNITED ARAB EMIRATES","UNITED KINGDOM","VATICAN CITY","WESTERN SAHARA","YEMEN","ZAMBIA","ZIMBABWE"];


$(document).ajaxComplete(function(e, x, s) {
    console.log('ajax triggred');
    deletetable();
    addtable();
})

$(document).ready(() => {
    console.log('document ready');
    addtable();
})

function checkregion(country) {
    if (apcj.indexOf(country)) {
        return 'APCJ';
    } else if ( na.indexOf(country)) {
        return 'NA';
    } else if (emea.indexOf(country)) {
        return 'EMEA';
    } else {
        return 'UNKNOWN';
    }
}

function deletetable() {
    document.getElementById('nseq').remove();
}
function addtable() {
    var j; var xx,x1;
    var url1 = '/sr/owner/NSE/?json=1'
    var severity = /[12]/;

    fetch(url1).then(function(response) {
        return response.json();
    }).then(function(j) {
        xx = j;
        x1 = j.data.filter(x => severity.test(x.severity))
            .map( value =>{
            if (value.entitlement_type == '') {
                value.entitlement_type = 'No Support';
            }
            return [value.sr_number,
                    value.owner,
                    severity.exec(value.severity)[0],
                    value.substatus,
                    value.product,
                    value.problem_statement,
                    value.account,
                    value.slm,
                    value.entitlement_type,
                    value.location_country,
                    checkregion(value.location_country)]
        });
        console.log('nse1 queue list get!');
        var tbl = document.createElement('table');
        tbl.classList.value += ' queue sr-list';
        tbl.style.width = "100%";
        tbl.id = 'nseq';
        $(tbl).DataTable( {
            data: x1,
            columns: [
                {
                    title: "SR",
                    render: (tdata,ttype,trow,tmeta) => {
                        return '<a href="/sr/' + tdata + '"target="_blank">' + tdata + '</a>';
                    }
                },
                {
                    title: "Owner",
                    render: function(y1,y2,y3,y4) {
                        // console.log(y1); data
                        // console.log(y2); type --> display
                        // console.log(y3); row  --> this row
                        // console.log(y4); setting and metadata
                        return y1;
                    }
                },
                {
                    title: "Sev" ,
                    render: (tdata,ttype,trow,tmeta) => {
                        return '<span class="severity sev' + tdata + '">Sev ' + tdata +'</span>';
                    }
                },
                { title: "Status" },
                { title: "Product" },
                { title: "Problem Statement" },
                { title: "Account" },
                { title: "SLM" },
                { title: "Entitlement" },
                { title: "Country" },
                { title: "Region" }
            ]
        } );
        // console.log(tbl);
        var quetag = document.getElementById('queue_wrapper');
        quetag.appendChild(tbl);
    });
}

/*  example json
        {
            "account": "Google Cloud Platform",
            "area": "Must Specify",
            "aspenns_closed": false,
            "aspenns_name": "drummond",
            "aspenns_root": "C3116910",
            "closed": null,
            "cloud_platform": "",
            "contact": "daisuke.ichimaru@bitcrew.co.jp",
            "contact_first": "Daisuke",
            "contact_last": "Ichimaru",
            "created": "2019-10-15T18:46:08-07:00",
            "csp_created": "2019-10-15T18:44:30-07:00",
            "csp_updated": "2019-10-15T18:44:30-07:00",
            "entitlement_level": "Level 1-3",
            "entitlement_type": "Premium",
            "has_children": false,
            "has_first_response": false,
            "has_orders": false,
            "hot": false,
            "last_modified": "2019-10-22T01:50:14-07:00",
            "last_modified_by": "AORTIZ",
            "last_resolved": null,
            "location_country": "UNITED STATES",
            "location_state": "CA",
            "managed_escalation": false,
            "originator": "EAIUSER",
            "owner": "NSE",
            "parent": "",
            "parent_name": null,
            "phone": "+810975296556",
            "platform": "LIC-PKG-BIG-BASEKEY-VER5B",
            "platform_id": "",
            "platform_part_number": "LIC-PKG-BIG-ADD-APM-VE-MKT",
            "premium_plus": false,
            "premium_plus_sdm_only": false,
            "problem_statement": "JPN: Doesn't displayed logging with login ID on GCP (QLJP)",
            "product": "BIG-IP APM VE",
            "rowid": "1-2K89IAJ",
            "security_flag": false,
            "serial": "GLJDWHP",
            "serial_parent_id": "PFMWMHA",
            "service_level": null,
            "service_provider": false,
            "service_provider_essentials": false,
            "severity": "4 - General Assistance",
            "site": "377683",
            "slm": "-147:32",
            "slm_due": "2019-10-16T18:44:30-07:00",
            "slm_indicator": "SLM less than 30 min",
            "special_sla": false,
            "sr_number": "C3116910",
            "status": "Open",
            "subarea": "",
            "substatus": "Monitor",
            "version": "13.1.1"
        },
*/