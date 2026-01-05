// ==UserScript==
// @name        OscarLibrary
// @namespace   OscarLibrary
// @version     2015.07.29
// @require     http://code.jquery.com/jquery-1.11.3.min.js
// @grant       unsafeWindow
// ==/UserScript==

// @run-at      document-end

var IsMainWindow = true;
try {
    IsMainWindow = self.frames.location.href === top.location.href;
} catch (ex) {
    IsMainWindow = false;
    console.debug(ex);
}

Date.prototype.formatDate = function(separator) {
    if (typeof separator == 'undefined' || typeof separator != 'string') separator = '-';
    var yy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    return yy + separator + (mm[1] ? mm : '0' + mm[0]) + separator + (dd[1] ? dd : '0' + dd[0]);
};
Date.prototype.formatTime = function(separator) {
    if (typeof separator == 'undefined' || typeof separator != 'string') separator = ':';
    var hh = this.getHours().toString();
    var mm = this.getMinutes().toString();
    var ss = this.getSeconds().toString();
    return (hh[1] ? hh : '0' + hh[0]) + separator + (mm[1] ? mm : '0' + mm[0]) + separator + (ss[1] ? ss : '0' + ss[0]);
};
Date.prototype.formatDateTime = function(dateSeparator, timeSeparator) {
    return this.formatDate(dateSeparator) + ' ' + this.formatTime(timeSeparator);
};
Date.prototype.addDays = function(days) {
    if (typeof days != 'number') days = 0;
    this.setDate(this.getDate() + days);
    return this;
};

var Cache = {
    read: function(key) {
        var value = localStorage.getItem(key);
        return JSON.parse(unescape(value)) || {};
    },
    write: function(key, obj) {
        var value = JSON.stringify(obj || {});
        localStorage.setItem(key, escape(value));
    },
    remove: function(key) {
        if (key)
            localStorage.removeItem(key);
        else
            localStorage.clear();
    }
};

$ = $ || unsafeWindow.$;

var ElementBuilder = {
    containerId: null,
    buildCss: function(content) {
        var css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = content;
        document.getElementsByTagName('header')[0].appendChild(css);
    },
    buildHtml: function(content, parent) {
        parent = parent || $('body');
        parent.append(content);
    },
    buildContainer: function(id) {
        this.containerId = id;
        if (!$('#' + id).length) {
            this.buildHtml('<div id="' + id + '" style="position:fixed;top:100px;left:0;opacity:0.7;font-family:verdana;font-size:12px;z-index:999999">' +
                '<div id="' + id + '_Left" style="float:left;background:red;cursor:pointer;width:8px;min-height:23px"></div>' +
                '<div id="' + id + '_Right" style="float:left"></div>' +
                '</div>');
            var cache = Cache.read(id + '_Cache');
            ElementBuilder.show = !cache.toggle ? true : false;
            $('#' + id + '_Left').click(this.event_Toggle).click();
        }
        return $('#' + id + '_Right');
    },
    buildComponent: function(content, containerId) {
        containerId = containerId || this.containerId;
        if (!containerId) return;
        var parent = this.buildContainer(containerId);
        this.buildHtml(content, parent);
        //$('#' + containerId + '_Left').css('height', parent.height());
    },
    show: true,
    event_Toggle: function() {
        ElementBuilder.show = !ElementBuilder.show;
        Cache.write(ElementBuilder.containerId + '_Cache', { toggle: ElementBuilder.show });
        $('#' + ElementBuilder.containerId + '_Right').css('display', ElementBuilder.show ? '' : 'none');
        //$(this).next().toggle();
    }
};

function ServerClock() {
    var self = this;
    var now = new Date().getTime();
    var lastCheck;
    this.checkInterval = 20000;
    this.checkServer = true;
    var queryLocal = function() {};
    var onServerResponse = function(http, start) {};
    var queryServer = function() {
        var start = new Date().getTime();
        var http = new XMLHttpRequest();
        try {
            //http.open('HEAD', '.', false);
            http.open('HEAD', '#', true);
            http.setRequestHeader('Range', 'bytes=-1');
            http.onreadystatechange = function() {
                if (http.readyState === 2)
                    onServerResponse(http, start);
            };
            http.send(null);
        } catch (e) {
            console.debug(e);
            onServerResponse(http, start);
        }
    };
    var check = function() {
        if (self.checkServer)
            queryServer();
        else
            queryLocal();
    };
    queryLocal = function() {
        now = new Date().getTime();
        setTimeout(check, self.checkInterval);
    };
    onServerResponse = function(http, start) {
        var end = new Date().getTime();
        var currentCheck = http.getResponseHeader('Date');
        if (lastCheck !== currentCheck) {
            lastCheck = currentCheck;
            now = new Date(currentCheck).getTime() + parseInt((end - start) / 2, 10);
            setTimeout(check, self.checkInterval);
        } else {
            self.toggleCheck(false);
            queryLocal();
        }
    };
    this.id = null;
    var control = null;
    this.init = function(ctrlId) {
        this.id = ctrlId;
        control = document.getElementById(ctrlId);
        var cache = Cache.read(this.id + '_Cache');
        this.checkServer = cache.checkServer ? true : false;
    };
    var tickTock = function() {
        var date = new Date(now);
        var time = date.formatTime();
        control.innerHTML = time;
        now += 1000;
        setTimeout(tickTock, 1000);
        self.onTickTock(date.formatDate(), time);
    };
    this.run = function() {
        check();
        tickTock();
    };
    this.toggleCheck = function(value) {
        self.checkServer = typeof value == 'boolean' ? value : !self.checkServer;
        Cache.write(self.id + '_Cache', { checkServer: self.checkServer });
        self.onToggleCheck();
    };
    this.onToggleCheck = function() {};
    this.onTickTock = function(date, time) {};
}

function Booking() {
    var self = this;
    this.isLooped = true;
    this.interval = 500;
    this.isStopped = false;
    var onResponse = function(rsp, url, method, data) {
        if (self.onResponse(rsp, url, method, data)) {
            self.isStopped = true;
            self.onFinished();
        } else
            self.onUnfinished(rsp, url, method, data);
    };
    this.query = function(url, method, data) {
        var request = url + (/\/[^\/\?]*\?/.test(url) ? '&' : '?') + new Date().getTime() + '=';
        if (method && method.toLowerCase() === 'get')
            $.get(request, function(rsp) {
                onResponse(rsp, url, method, data);
            });
        else
            $.post(request, data, function(rsp) {
                onResponse(rsp, url, method, data);
            });
    };
    this.onResponse = function(rsp, url, method, data) {};
    this.onFinished = function() {};
    this.onUnfinished = function(rsp, url, method, data) {
        if (this.isLooped && !this.isStopped)
            setTimeout(function() {
                self.query(url, method, data);
            }, this.interval);
    };
}

var serverClock = new ServerClock();

(function() {
    if (!IsMainWindow) return;

    ElementBuilder.buildContainer('o_container');
    ElementBuilder.buildComponent('<div>服务器时间: <span id="o_serverClock"></span><input type="button" id="o_btnServerClock" style="width:80px"></div>');

    serverClock.init('o_serverClock');
    serverClock.onToggleCheck = function() {
        document.getElementById('o_btnServerClock').value = serverClock.checkServer ? '本地时间' : '服务器时间';
        document.getElementById(serverClock.id).style.color = serverClock.checkServer ? 'red' : '';
    };

    $('#o_btnServerClock').val(function() {
        document.getElementById(serverClock.id).style.color = serverClock.checkServer ? 'red' : '';
        return serverClock.checkServer ? '本地时间' : '服务器时间';
    }).click(function() {
        setTimeout(serverClock.toggleCheck, 0);
    });

    serverClock.run();
})();