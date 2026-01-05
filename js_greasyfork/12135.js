var ajaxListener = new Object();
if (typeof XMLHttpRequest === "undefined") {
    XMLHttpRequest = function () {
        try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
        catch (e) { }
        try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
        catch (e) { }
        try { return new ActiveXObject("Microsoft.XMLHTTP"); }
        catch (e) { }
        throw new Error("This browser does not support XMLHttpRequest.");
    };
}
ajaxListener.open = XMLHttpRequest.prototype.open;
ajaxListener.send = XMLHttpRequest.prototype.send;

ajaxListener.onOpen = function (method, url, async, user, password) { };
ajaxListener.onSend = function (data, arg) { };
ajaxListener.onCallback = function () { };

XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    ajaxListener.xhr = this;
    ajaxListener.method = method;
    ajaxListener.url = url;
    ajaxListener.async = async;
    ajaxListener.user = user;
    ajaxListener.password = password;
    if (method.toLowerCase() == "get") {
        ajaxListener.data = user.split("?");
        ajaxListener.data = ajaxListener.data[1];
    }
    if (typeof ajaxListener.onOpen == "function") {
        ajaxListener.onOpen(method, url, async, user, password);
        for (var i = 0; i < arguments.length; i++) {
            switch (i) {
                case 0: arguments[i] = ajaxListener.method; break;
                case 1: arguments[i] = ajaxListener.url; break;
                case 2: arguments[i] = ajaxListener.async; break;
                case 3: arguments[i] = ajaxListener.user; break;
                case 4: arguments[i] = ajaxListener.password; break;
            }
        }
    }
    ajaxListener.open.apply(this, arguments);
};

XMLHttpRequest.prototype.send = function (data, arg) {
    if (ajaxListener.method.toLowerCase() == "post")
        ajaxListener.data = data;
    ajaxListener.arg = arg;
    if (typeof ajaxListener.onSend == "function") {
        ajaxListener.onSend(data, arg);
        for (var i = 0; i < arguments.length; i++) {
            switch (i) {
                case 0: arguments[i] = ajaxListener.data; break;
                case 1: arguments[i] = ajaxListener.arg; break;
            }
        }
    }

    ajaxListener.onreadystatechange = this.onreadystatechange;
    this.onreadystatechange = function () {
        ajaxListener.onreadystatechange.apply(this);
        if (this.readyState == 4
            && typeof ajaxListener.onCallback == "function")
            ajaxListener.onCallback();
    };

    ajaxListener.send.apply(this, arguments);
};