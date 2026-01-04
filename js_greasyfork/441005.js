class Request {
    constructor(url, params, successFn, errorFn, options = {}) {
        this.url = new URL(url);
        this.url.search = new URLSearchParams(params).toString();
        this.successFn = successFn;
        this.errorFn = errorFn;
        this.options = options;
    }

    send(cb) {
        fetch(this.url, this.options).then(res => {
            cb();
            if (this.successFn) {
                this.successFn(res);
            }
        }).catch(err => {
            cb();
            if (this.errorFn) {
                this.errorFn(err);
            }
        });
    }
}

class Web {
    base = window.location.origin;

    constructor(apiKey = null) {
        this.key = apiKey;
        this.requests = [];
    }

    get(path, params, successFn, errorFn, options = {}) {
        const req = new Request(`${this.base}${path}`, params, successFn, errorFn, options);
        this.queue(req);
    }

    api(path, params, successFn, errorFn) {
        params.k = this.key;
        const req = new Request(`${this.base}/api${path}`, params, successFn, errorFn);
        this.queue(req);
    }

    queue(req) {
        this.requests.push(req);
        if (this.requests.length === 1) {
            this.next();
        }
    }

    next() {
        if (this.requests.length === 0) {
            return;
        }
        const req = this.requests[0];
        req.send(() => {
            this.requests.shift();
            this.next();
        });
    }
}