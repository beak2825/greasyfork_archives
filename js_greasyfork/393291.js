// ==UserScript==
// @id             iitc-plugin-spy-agent-activity@odrick
// @name           IITC plugin: Spy agent activity
// @author Odrick
// @category       Layer
// @license MIT
// @version        0.0.3
// @description    Spy agent activity on map
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// @namespace https://greasyfork.org/users/410740
// @downloadURL https://update.greasyfork.org/scripts/393291/IITC%20plugin%3A%20Spy%20agent%20activity.user.js
// @updateURL https://update.greasyfork.org/scripts/393291/IITC%20plugin%3A%20Spy%20agent%20activity.meta.js
// ==/UserScript==

function wrapper(plugin_info) {
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    plugin_info.buildName = 'Spy agent activity';
    plugin_info.dateTimeVersion = '20191201111500';
    plugin_info.pluginId = 'iitc-plugin-spy-agent-activity@odrick';

    window.plugin.spyAgentActivity = function () {};

    var viewPathOptions = {
        color: "#ffffff",
        weight: 3,
        fill: false,
        interactive: false,
        clickable: false,
        opacity: 0.8,
        dashArray: "5,8"
    };

    var viewStartOptions = {
        color: "#ff33ff",
        weight: 3,
        fill: false,
        interactive: false,
        clickable: false,
        opacity: 1,
        radius: 8
    };

    var viewEndOptions = {
        color: "#ff3333",
        weight: 3,
        fill: false,
        interactive: false,
        clickable: false,
        opacity: 1,
        radius: 10
    };

    var markerImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAABACAMAAABfh8VoAAABF1BMVEUAAADtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTLtJTL////sAAD//f3tIC/tBiHtAB7++vr98fHuTlX97e361tb2tLX1rq/wdXjtESb739/3wcP0pqjznqDtN0DtND7tKDT99fX4z9D5zM34xsf2u731qqzxfoLvW2DtOULsAA7sAAz98/P74uPznZ/wbHDwa27vYGbtIC5GWK0FAAAANHRSTlMA/Av0E9fPUCUc9+7hv5iDbmljGQgE6OTcx8Krko17VnZcLirTpJ6bSzQPDdm4sJZGRDw7zF+SyQAAAj1JREFUSMeNlGd7mzAQgA8M8Yj3dryTtBnd7QEe8Uy80mYn3f//d8TmOfHIIBneTzZ64XRDgi3UXLOW0EOxciLZjqog4yhzgByV9KFQ02pldBFP5rze5yIK2A+7vRRKqAPPu7copXrOieRJzIIw7uWzueblkntUA+ILMv6vBovR0LKGo/lg1UEGZaQ5+Xb/zvoG0Z9Ne07uUVus099r8/eFwXExN69p6cTuB6uzObaMLaw7k5ZKmx5lWNwFeZx5z6K3CqAm0Kbzh8Xlo08poz0VovTOamYIuF3ScgSa9GvQF4nWgJYzUKM6Lwwhky7avAHa4vNILF6ZtEnQqTZDsdgnMQQhEi1DDIkIsaBiOWhoOk8vPskcQ5LKM99dniq0WcHFm3yk5bTTwuWtyPvx5LRQrdBQTAVD8f2BhkJXAdL0Tu/eO2ZjNmaNAsBhnA3unXtwb1gRi2ew5sQ5CpOfW3HHG49GYkMkhkRvesPl8eAcrtgZ2CSR0Vk+Tq6sddBf439PHWRU2YWCHF3TposcOSAaSPjdU1pJbtHxJ9K7xFQBHCLv5V78CDjqilRMAk9uX+aFIgGv5k/gIiT2lLxbzIrFFrg5PxamrAEE+mQavET3vJ4eAQENxZNJCkSoRU+XNRCScYsNkFByNQVkhLfFtlTM00XkXPBSmryYBTlaBR0qOdhBRnFq2IKd6Ews5XeLYf8dEtTxOPjxFW1OfcXCx42XyIMvpzFEJQz+5D8gHmgQgKaiZCEQezoE45toh68XakcXKatJ2AAAAABJRU5ErkJggg==';

    var list = {};
    var fullList = {};
    var agentName = '';
    var currentPosition = null;
    var viewLayer;
    var activeMarker = null;
    var agentsList = {};
    var selectedFromPeriod = -1;
    var selectedToPeriod = -1;
    var newEvents = false;

    function startSpy(agent, fromPeriod, toPeriod) {
        viewLayer.clearLayers();

        agentName = agent;

        if(!fromPeriod || fromPeriod < 0) selectedFromPeriod = -1;
        else selectedFromPeriod = fromPeriod;

        if(!toPeriod || toPeriod < 0) selectedToPeriod = -1;
        else selectedToPeriod = toPeriod;

        var b = clampLatLngBounds(map.getBounds());
        var ne = b.getNorthEast();
        var sw = b.getSouthWest();

        var max = selectedToPeriod < 0 ? Date.now() : selectedToPeriod;
        var min = selectedFromPeriod < 0 ? Date.now() - 30 * 60 * 1000 : selectedFromPeriod;
        var end = max;

        function fetchData() {
            var data = {
                minLatE6: Math.round(sw.lat*1E6),
                minLngE6: Math.round(sw.lng*1E6),
                maxLatE6: Math.round(ne.lat*1E6),
                maxLngE6: Math.round(ne.lng*1E6),
                minTimestampMs: min,
                maxTimestampMs: max,
                tab: 'all'
            };

            window.postAjax('getPlexts', data, handleData, handleError);
            newEvents = true;
        }

        function handleData(data) {
            var minDate = Number.MAX_VALUE;

            for(var i=0; i<data.result.length; i++) {
                var msg = data.result[i];
                var date = msg[1];

                processMessage(msg);

                if(date < minDate) minDate = date;
            }

            render();

            if(data.result.length === 0 || minDate <= min) {
                if(currentPosition) window.map.setView(currentPosition, window.map.getZoom());
                setDefaultStatus();
                updateAgentsList();
                return;
            }
            else {
                max = minDate-1;
                fetchData();
            }

            var prc = 0;
            if(max !== end) {
                var period = end - min;
                var fetched = max - min;
                prc = 1 - (fetched / period);
            }

            $("#spyAgentStatus").html("loading " + Math.floor(prc*100) + "%...");
        }

        function handleError(err) {
            setDefaultStatus();
            render();
        }

        fetchData();
    }

    function setDefaultStatus() {
        var from;
        var to;

        if(selectedFromPeriod < 0) from = 'now';
        else from = formatDate(new Date(selectedFromPeriod));

        if(selectedToPeriod < 0) to = 'now';
        else to = formatDate(new Date(selectedToPeriod));

        $("#spyAgentStatus").html(from + " - " + to);
    }

    function updateAgentsList() {
        var agents = Object.keys(agentsList);
        var content = '';

        content += '<option value=""></option>';

        var alist = [];
        for(var i=0; i<agents.length; i++) {
            alist.push(agentsList[agents[i]]);
        }

        alist = alist.sort(function(a, b) {
            if(a.team === b.team) {
                return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
            }
            return a.team > b.team ? 1 : -1;
        });

        for(i=0; i<alist.length; i++) {
            var agent = alist[i];

            content += '<option value="' + agent.name + '"';
            if(agent.name === agentName) content += ' selected="selected"';
            content += ' class="spyAgent' + agent.team + '"';
            content += '>';
            content += agent.name;
            content += '</option>';
        }

        $("#spyAgentsList").html(content);
    }

    function getPositionFromEvent(event) {
        for(var i=0; i<event.plext.markup.length; i++) {
            var markup = event.plext.markup[i];
            if(markup[0] === "PORTAL") {
                return {lat: markup[1].latE6 / 1e6, lng: markup[1].lngE6 / 1e6};
            }
        }

        return null;
    }

    function normalizeEvents() {
        var events = [];
        var keys = Object.keys(list);

        for(var i=0; i<keys.length; i++) {
            events.push(list[keys[i]]);
        }

        events = events.sort(function(a, b) {
            if(a.date > b.date) return 1;
            if(a.date < b.date) return -1;
            return 0;
        });

        return events;
    }

    function formatDate(date) {
        var mn = date.getMonth() + 1;
        if(mn < 10) mn = "0" + mn;

        var d = date.getDate();
        if(d < 10) d = "0" + d;

        var h = date.getHours();
        if(h < 10) h = "0" + h;

        var m = date.getMinutes();
        if(m < 10) m = "0" + m;

        return d + "." + mn + " " + h + ":" + m;
    }

    function getTextFromEvent(event) {
        var content = '<div class="spyAgentContentRow">';

        content += '<span class="spyAgentContentDate">' + formatDate(event.nativeDate) + '</span>&nbsp;';

        for(var i=0; i<event.plext.markup.length; i++) {
            var markup = event.plext.markup[i];
            switch(markup[0]) {
                case "PLAYER":
                    content += '&nbsp;<b class="' + markup[1].team + '">' + markup[1].plain + '</b>&nbsp;';
                    break;
                case "PORTAL":
                    var lat = markup[1].latE6/1e6;
                    var lng = markup[1].lngE6/1e6;
                    content += '<a onclick="window.plugin.spyAgentActivity.scrollTo('+lat+', '+lng+');window.selectPortalByLatLng('+lat+', '+lng+');return false;">';
                    content += markup[1].name;
                    content += '</a>';
                    break;
                default:
                    content += markup[1].plain;
            }
            content += " ";
        }

        content += "</div>";

        return content;
    }

    function scrollTo(lat, lng) {
        window.map.setView({lat: lat, lng: lng}, window.map.getZoom());
    }

    function render() {
        var events = normalizeEvents();

        viewLayer.clearLayers();
        if(events.length < 1) return;

        currentPosition = null;

        $("#spyAgentContent").html("");
        var content = "";

        for(var i=0; i<events.length; i++) {
            var event = events[i];
            var position = getPositionFromEvent(event);

            if(currentPosition) {
                L.geodesicPolyline([currentPosition, position], viewPathOptions).addTo(viewLayer);
            }
            else {
                L.circleMarker(position, viewStartOptions).addTo(viewLayer);
            }

            content += getTextFromEvent(event);
            currentPosition = position;
        }

        if(currentPosition) {
            var icon = L.icon({
                iconUrl: markerImage,
                iconSize: [20, 32],
                iconAnchor: [10, 32]
            });
            L.marker(currentPosition, {icon: icon}).addTo(viewLayer);
        }

        $("#spyAgentContent").html(content);
        $("#spyAgentContent").scrollTop($("#spyAgentContent")[0].scrollHeight);

        newEvents = false;
    }

    function processMessage(msg) {
        var id = msg[0];
        var date = msg[1];
        var plext = msg[2].plext;

        if(plext.markup) {
            var data = {
                id: id,
                date: date,
                nativeDate: new Date(date),
                plext: plext
            };

            var valid = false;
            var skip = false;

            for(var n=0; n<plext.markup.length; n++) {
                var markup = plext.markup[n];
                if(markup[0] === 'PLAYER') {
                    var name = String(markup[1].plain);
                    if(!agentsList[name]) agentsList[name] = {name: name, team: markup[1].team};

                    if(markup[1].plain === agentName) {
                        valid = true;
                        if(selectedFromPeriod > 0 && date < selectedFromPeriod) valid = false;
                        if(selectedToPeriod > 0 && date > selectedToPeriod) valid = false;
                    }
                }
                if(markup[0] === 'TEXT') {
                    if(markup[1].plain.indexOf('destroyed the Link') !== -1 || markup[1].plain.indexOf('destroyed a Control Field') !== -1 || markup[1].plain.indexOf('Your Link') !== -1) {
                        valid = false;
                        skip = true;
                    }
                }
            }

            if(valid) {
                list[id] = data;
                if(!list[id]) newEvents = true;
            }
            if(!skip) fullList[id] = data;
        }
    }

    function handlePublicData(data) {
        for(var i=0; i<data.result.length; i++) {
            processMessage(data.result[i]);
        }

        updateAgentsList();
        render();
    }

    function saveBoxPosition() {
        if($('#spyAgentBox').css('display') === 'none') return;

        var x = parseInt($('#spyAgentBox').css('top'));
        var y = parseInt($('#spyAgentBox').css('left'));

        localStorage.setItem('iitc-agent-spy-box-x', x);
        localStorage.setItem('iitc-agent-spy-box-y', y);
    }

    function hideBox() {
        $('#spyAgentBox').css({display: 'none'});
    }

    function showBox() {
        $('#spyAgentBox').css('display') === 'block' ? $('#spyAgentBox').css({display: 'none'}) : $('#spyAgentBox').css({display: 'block'});
    }

    function setupCSS() {
        var css = '#spyAgentBox{display:none;position:absolute!important;z-index:5001;top:50px;left:70px;width:500px;height:450px;overflow:hidden;background:rgba(8,48,78,.9);border:1px solid #20a8b1;color:#ffce00;padding:8px}#spyAgentBox #topBar{height:15px!important}#spyAgentBox #topBar *{height:14px!important}#spyAgentBox .handle{width:89%;text-align:center;color:#fff;line-height:6px;cursor:move;float:right}#spyAgentBox #topBar .btn{display:block;width:10%;cursor:pointer;color:#20a8b1;font-weight:700;text-align:center;line-height:13px;font-size:18px;border:1px solid #20a8b1;float:left}#spyAgentBox #topBar .btn:hover{color:#ffce00;text-decoration:none}#spyAgentsList{background:#000;border:1px solid #20a8b1;color:#fff;height:20px;width:170px;margin-right:38px}#spyAgentHistory{background:#000;border:1px solid #20a8b1;color:#fff;height:20px;width:100px}#spyAgentControls{border-top:1px solid #20a8b1;border-bottom:1px solid #20a8b1;padding-top:4px;padding-bottom:4px;clear:both}#spyAgentStart{background:rgba(8,48,78,1);border:1px solid #20a8b1;color:#ffce00;height:20px}#spyAgentContent{width:100%;height:385px;overflow:auto;overflow-x:hidden;font-size:12px;border-bottom:1px solid #20a8b1}#spyAgentStatus{padding-top:8px;padding-bottom:4px;font-size:12px;color:#fff;float:left}#spyAgentsListContainer{padding-top:4px;padding-bottom:4px;font-size:12px;color:#fff;float:right}.spyAgentContentRow{color:#fff;white-space:nowrap}.spyAgentContentDate{color:#999}.spyAgentRESISTANCE{color:#08f}.spyAgentENLIGHTENED{color:#03dc03}#spyAgentDateSelector{text-align:center;color:#fff;padding:4px;border-bottom:1px solid #20a8b1;display:none}#spyAgentDateSelector button{background:rgba(8,48,78,1);border:1px solid #20a8b1;color:#ffce00;height:20px}';
        $('<style>').prop('type', 'text/css').html(css).appendTo('head');
        //$('<link rel="stylesheet" type="text/css" href="http://localhost/spy.css"/>').appendTo('head');
    }

    function handleStartSpy() {
        list = {};

        var currentAgent = agentsList[agentName];
        agentsList = {};
        if(currentAgent) agentsList[agentName] = currentAgent;

        viewLayer.clearLayers();
        $("#spyAgentContent").html('');

        var name = $("#spyAgentsList").val().trim();

        var history = $("#spyAgentHistory").val();

        localStorage.setItem('iitc-agent-spy-name', name);
        localStorage.setItem('iitc-agent-spy-history', history);

        var from = -1;
        var to = -1;

        switch(history) {
            case 'now':
                break;
            case '':
            case 'custom':
                from = selectedFromPeriod;
                to = selectedToPeriod;
                break;
            default:
                from = Date.now() - parseInt(history) * 60 * 60 * 1000;
        };

        startSpy(name, from, to);
    }

    function setupUI() {
        var content = '';

        content += '<div id="spyAgentBox">';
        content += '    <div id="topBar">'
        content += '        <a id="spyAgentMin" class="btn" onclick="window.plugin.spyAgentActivity.hideBox();return false;" title="Minimize">-</a>'
        content += '        <div class="handle">...</div>'
        content += '    </div>'
        content += '    <div id="spyAgentControls">'
        content += '    Agent name: <select id="spyAgentsList" onchange="window.plugin.spyAgentActivity.handleSwitchTo()"></select>';
        content += '    History:';
        content += '    <select id="spyAgentHistory" onchange="window.plugin.spyAgentActivity.handleHistoryChange();return false;">';
        content += '    <option value=""></option>';
        content += '    <option value="now">now</option>';
        content += '    <option value="1">1 hour</option>';
        content += '    <option value="2">2 hours</option>';
        content += '    <option value="3">3 hours</option>';
        content += '    <option value="6">6 hours</option>';
        content += '    <option value="12">12 hours</option>';
        content += '    <option value="custom">custom</option>';
        content += '    </select>';
        content += '    <button id="spyAgentStart" onclick="window.plugin.spyAgentActivity.handleStartSpy();return false;">LOAD</button>';
        content += '    </div>';
        content += '    <div id="spyAgentDateSelector">';
        content += '        from: <input type="text" id="spyAgentDateSelectorFrom"/>';
        content += '        to: <input type="text" id="spyAgentDateSelectorTo"/>';
        content += '        <button id="spyAgentDateSelectorOk" onclick="window.plugin.spyAgentActivity.handleDateSelectorOk();return false;">OK</button>';
        content += '        <button id="spyAgentDateSelectorCancel" onclick="window.plugin.spyAgentActivity.handleDateSelectorCancel();return false;">CANCEL</button>';
        content += '    </div>';
        content += '    <div id="spyAgentContent"></div>';
        content += '    <div id="spyAgentStatus">ready</div>';
        content += '</div>';

        $('body').append(content);
        $('#spyAgentBox').draggable({handle: '.handle', containment: 'window'});

        $('#toolbox').append('<a onclick="window.plugin.spyAgentActivity.showBox();return false;">Spy agent</a>');

        $('<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.3/flatpickr.min.css"/>').appendTo('head');
        $('<script src="//cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.3/flatpickr.min.js"/>').appendTo('head');
    }

    function loadDefaults() {
        var name = localStorage.getItem('iitc-agent-spy-name');
        agentName = name;

        var history = localStorage.getItem('iitc-agent-spy-history');
        if(history !== undefined) $('#spyAgentHistory').val(history);
    }

    function setup() {
        viewLayer = new L.LayerGroup();
        setupCSS();
        setupUI();
        window.addLayerGroup('Spy agent', viewLayer, false);
        window.addHook('publicChatDataAvailable', handlePublicData);

        loadDefaults();
        setDefaultStatus();

        setInterval(saveBoxPosition, 1000);

        var x = parseInt(localStorage.getItem('iitc-agent-spy-box-x'));
        var y = parseInt(localStorage.getItem('iitc-agent-spy-box-y'));

        if(isNaN(x) || isNaN(y)) return;
        $('#spyAgentBox').css({top: x, left: y});
    }

    function switchTo(toName) {
        list = {};
        agentName = toName.trim();

        if(toName) {
            var ids = Object.keys(fullList);

            for(var i=0; i<ids.length; i++) {
                var id = ids[i];
                var plext = fullList[id].plext;

                for(var n=0; n<plext.markup.length; n++) {
                    var markup = plext.markup[n];
                    if(markup[0] === 'PLAYER') {
                        if(markup[1].plain === agentName) {
                            list[id] = fullList[id];
                            newEvents = true;
                        }
                    }
                }
            }
        }
        else {
            currentPosition = null;
        }

        render();
        if(currentPosition) window.map.setView(currentPosition, window.map.getZoom());
    }

    function handleSwitchTo() {
        switchTo($("#spyAgentsList").val());
    }

    var dateSeletorFrom = null;
    var dateSeletorTo = null;

    function showDateSelector() {
        $("#spyAgentDateSelector").css({display: 'block'});

        if(!dateSeletorFrom) dateSeletorFrom = flatpickr("#spyAgentDateSelectorFrom", {enableTime: true, time_24hr: true});
        if(!dateSeletorTo) dateSeletorTo = flatpickr("#spyAgentDateSelectorTo", {enableTime: true, time_24hr: true});

        window.dateSeletorFrom = dateSeletorFrom;
    }

    function hideDateSelector() {
        $("#spyAgentDateSelector").css({display: 'none'});
    }

    function handleDateSelectorOk() {
        if(!dateSeletorFrom.selectedDates[0]) {
            alert("Invalid start period");
            return;
        }
        var from = dateSeletorFrom.selectedDates[0].getTime();

        if(!dateSeletorTo.selectedDates[0]) {
            alert("Invalid end period");
            return;
        }
        var to = dateSeletorTo.selectedDates[0].getTime();

        if(to < from) {
            alert("End greater than start");
            return;
        }

        if(to - from > 12 * 60 * 60 * 1000) {
            alert("Selected period to big - 12h max");
            return;
        }

        $("#spyAgentHistory").val('');
        hideDateSelector();

        selectedFromPeriod = from;
        selectedToPeriod = to;

        handleStartSpy();
    }

    function handleDateSelectorCancel() {
        $("#spyAgentHistory").val('');
        hideDateSelector();
    }

    function handleHistoryChange() {
        var history = $("#spyAgentHistory").val();
        if(history === 'custom') showDateSelector();
        else hideDateSelector();
    }

    window.plugin.spyAgentActivity.startSpy = startSpy;
    window.plugin.spyAgentActivity.showBox = showBox;
    window.plugin.spyAgentActivity.hideBox = hideBox;
    window.plugin.spyAgentActivity.handleStartSpy = handleStartSpy;
    window.plugin.spyAgentActivity.scrollTo = scrollTo;
    window.plugin.spyAgentActivity.switchTo = switchTo;
    window.plugin.spyAgentActivity.handleSwitchTo = handleSwitchTo;
    window.plugin.spyAgentActivity.handleDateSelectorOk = handleDateSelectorOk;
    window.plugin.spyAgentActivity.handleDateSelectorCancel = handleDateSelectorCancel;
    window.plugin.spyAgentActivity.handleHistoryChange = handleHistoryChange;

    setup.info = plugin_info;

    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    if (window.iitcLoaded && typeof setup === 'function') setup();
}

var script = document.createElement('script');
var info = {};

if(typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
    info.script = {
        version: GM_info.script.version,
        name: GM_info.script.name,
        description: GM_info.script.description
    };
}

var textContent = document.createTextNode('('+ wrapper +')('+ JSON.stringify(info) +')');
script.appendChild(textContent);
(document.body || document.head || document.documentElement).appendChild(script);