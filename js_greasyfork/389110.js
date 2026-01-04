// ==UserScript==
// @name         alright2
// @version      1.1
// @description  Hello2
// @namespace    starve.io
// @author       noone
// @match        https://starve.io/
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/389110/alright2.user.js
// @updateURL https://update.greasyfork.org/scripts/389110/alright2.meta.js
// ==/UserScript==

function inject() {
    var $ = window.$;
    var client = window.client;

    var modeSelected = false;
    function setDefault(key, value) {
        if (!Object.prototype.hasOwnProperty.call(localStorage, key)) {
            localStorage.setItem(key, value);
        }
    }

    function get(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    setDefault("servers", JSON.stringify(["starve.sixserver.pl:1000"]));
    setDefault("debug.hide", JSON.stringify([0]));
    setDefault("debug.log.send", false);
    setDefault("debug.log.receive", false);

    var ws = window.WebSocket;
    window.WebSocket = function () {
        var that = new ws(...arguments);
        that.addEventListener("open", function () {
            console.log("connected: " + that.url);
        });
        that.addEventListener("close", function () {
            console.log("disconnected");
        });
        that.addEventListener("message", function (event) {
            var data = event.data;
            if (data instanceof ArrayBuffer) {
                data = new Uint8Array(data);
                if (get("debug.hide").includes(data[0])) {
                    return;
                }
            }
            if (get("debug.log.receive")) {
                console.log("received: " + data);
            }
        });
        return that;
    };
    window.WebSocket.prototype = ws.prototype;

    WebSocket.prototype.send = function (send) {
        return function (data) {
            var parsed = JSON.parse(data);
            if (parsed instanceof Array) {
                if (typeof parsed[0] == "string") {
                    if (modeSelected) {
                        parsed.push($("#password").val());
                    }
                }
                data = JSON.stringify(parsed)
            }
            if (get("debug.log.send")) {
                console.log("sending: " + data);
            }

            return send.apply(this, arguments);
        };
    }(WebSocket.prototype.send);

    var serverSelect = document.getElementById('servselect');
    var serverSelectVisible = false;

    var initialTops = {};
    var initialLefts = {};
    function updateCss() {
        serverSelectVisible = serverSelect.style.left != "" && serverSelect.style.display != "none";
        $(".ps-panel").css("display", function () {
            return modeSelected && serverSelectVisible ? "" : "none";
        });
        $("#mode-button").css("display", serverSelectVisible ? "" : "none");

        function pxToNumber(px) {
            return Number.parseFloat(px.replace("px"));
        }

        function watchStyle(styleName, dict) {
            $(".ps").css(styleName, function () {
                var key = this.id || this;
                if (isNaN(dict[key]))
                    dict[key] = pxToNumber(this.style[styleName]);
                return pxToNumber(serverSelect.style[styleName]) + dict[key];
            });
        }

        $(".clicky:active").css("top", function () {
            return pxToNumber(this.style.top) + 10;
        });

        watchStyle("top", initialTops);
        watchStyle("left", initialLefts);
        modeSelected ? $("#mode-button").addClass("active") : $("#mode-button").removeClass("active");
    }

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutationRecord) {
            updateCss();
            $("#trevda").hide();
        });
    });

    observer.observe(serverSelect, {
        attributes: true,
        attributeFilter: ['style']
    });

    var oldClient = client;
    window[oldClient.keys.client] = new Proxy(oldClient, {
        set: function (target, key, value) {
            oldClient[key] = value;

            if (key === client.keys.selectedMode || key === "selectedMode") {
                modeSelected = value == 6;
                updateCss();
            }
            return true;
        }
    });

    $("body").append(/*html*/`
<img id="mode-button" class="ps-cursor ps" style="display: none; left: -160px; top: 75px;">
<div class="ps-panel" style="display: none;">
<input id="ip" type="text" placeholder="ip/host" class="md-select ps-input ps" style="left: -5px; top: 54px;">
<input id="password" type="password" placeholder="password" class="md-select ps-input ps" style="left: -5px; top: 108px;">
<button id="add-button" class="ps-button ps ps-cursor clicky" style="left: 254px; top: 65px;">Add</button>
</div>
`);

    function addServer(ip) {
        $.ajaxSetup({ timeout: 1500 });
        $.get("https://" + ip + "/info").done(function (data) {
            data.info = ip;
            setMode(6, data)
        }).fail(function () {
            var data = { a: ip, nu: "offline" }
            data.info = ip;
            data.offline = true;
            setMode(6, data)
        });
    }

    for (const server of get("servers")) {
        addServer(server);
    }

    setTimeout(function() {
        setMode(0);
    }, 2000);

    function setMode(i = 6, data) {
        client.serversList[i] = client.serversList[i] || [{}];
        if (client.serversList[i].length <= 0)
            client.serversList[i].push({});
        client.selectedServer[i] = client.selectedServer[i] || 0;
        if (data) {
            if (client.serversList[i][0].info == undefined)
                client.serversList[i] = [];

            var server = client.serversList[i].find(x => x.info == data.info);
            if (server) {
                client.serversList[i][client.serversList[i].indexOf(server)] = data;
            } else {
                client.serversList[i].push(data);
            }
        }
        if (client.selectMode)
            client.selectMode(i);
        $("#ul-id.md-whiteframe-z1 li:first-child").text("Choose a server");
        $("#ul-id.md-whiteframe-z1 li:last-child").hide();

        var servers = $("#servselect #ul-id.md-whiteframe-z1 li:not(#selectDisabled)");
        if (JSON.stringify(client.serversList[i]) == "[{}]") {
            var msg = "Not added any servers";
            $("#servselect button.ng-binding").html(msg);
            servers.html(msg);
        } else {
            var index = 0;
            servers.html(function () {
                var data = client.serversList[i][index];
                var text = $(this).html();

                if (data && data.nu === "offline") {
                    text = data.info + " [offline]"
                    this.id = "selectDisabled";
                }

                if ($(this).hasClass("active")) {
                    $("#servselect button.ng-binding").html(text);
                }

                var html = text + /*html*/`
<div class="server-buttons" data-index="${index}">
<button class="refresh-button">⟳</button>
<button class="delete-button">×</button>
</div>
`;
                index++;
                return html;
            });

            if ($("#servselect #ul-id.md-whiteframe-z1 li").toArray().every(x => x.id == "selectDisabled")) {
                $("#servselect button.ng-binding").html("All servers are offline ;(");
            }

            $(".refresh-button").click(function () {
                addServer(client.serversList[i][$(this).parent().data("index")].info);
                setMode();
            });

            $(".delete-button").click(function () {
                client.serversList[i].splice($(this).parent().data("index"), 1)
                client.selectedServer[i]--;
                setMode();
            });

            servers.filter(":not(#selectDisabled)").click(function () {
                client.selectedServer[i] = $(this).find(".server-buttons").data("index");
                setMode();
            });
        }
    }

    $("#ip").val(localStorage.getItem('ip'));
    $("#add-button").click(function () {
        var ip = $("#ip").val();
        localStorage.setItem('ip', ip);
        addServer(ip);
    });

    $("#mode-button").click(function () {
        setMode()
    });
}

var link = document.createElement( "link" );
link.href = "https://gitcdn.link/repo/privatestarving/privatestarving.script/master/privatestarving.css"
link.type = "text/css";
link.rel = "stylesheet";

document.head.appendChild(link);

var script = document.createElement('script');
script.appendChild(document.createTextNode('(' + inject + ')();'));

function checkForClient() {
    if (unsafeWindow.client == undefined) {
        setTimeout(checkForClient, 50);
    } else {
        (document.body || document.head || document.documentElement).appendChild(script);
    }
}
checkForClient();