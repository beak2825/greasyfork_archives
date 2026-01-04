;(function () {
    let base = {
        init() {
            base.showNotice()
        },
        showNotice() {
            // todo wait
        },
        getUrlParam(url, name) {
            if (arguments.length == 1) {
                name = url;
                url = window.location;
            }
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = url.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return "";
        },
        objectToQueryString(obj) {
            var queryParams = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var value = obj[key];
                    // 如果值为数组，则将其转换为多个参数
                    if (Array.isArray(value)) {
                        for (var i = 0; i < value.length; i++) {
                            queryParams.push(
                                encodeURIComponent(key) + "=" + encodeURIComponent(value[i])
                            );
                        }
                    } else {
                        queryParams.push(
                            encodeURIComponent(key) + "=" + encodeURIComponent(value)
                        );
                    }
                }
            }
            return queryParams.join("&");
        },
        parseQueryString(url = window.location.href) {
            //url参数转对象
            url = !url ? window.location.href : url;
            if (url.indexOf("?") === -1) {
                return {};
            }
            let search =
                url[0] === "?"
                    ? url.substr(1)
                    : url.substring(url.lastIndexOf("?") + 1);
            if (search === "") {
                return {};
            }
            search = search.split("&");
            let query = {};
            for (let i = 0; i < search.length; i++) {
                let pair = search[i].split("=");
                query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
            }
            return query;
        }
    }
    base.init()
})();
