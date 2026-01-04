class multiKeys {
    constructor() {

        this.Created = "2023/1/14 17:14";
        this.last_modified = "2023/08/22 12:33:38";
        this.author = 'leizingyiu';
        console.log(`multiKeys by ${this.author}; created ${this.Created} ; last modified ${this.last_modified}`);

        var that = this;
        this.ignore = false;
        this.ignoreList = [];
        this.ignoreDict = [];

        this.console = function () {
            console.log(...arguments);
        };
        this.registration = {};
        this.allKeysArr = [];
        this.keys = [];
        this.waterKeys = [];

        this.tokenJoining = '_';
        this.tokenSortFunction = (_a, _b) => {
            let a = String(_a),
                b = String(_b);
            if (a.length != b.length) {
                return a.length - b.length;
            } else {
                return a.localeCompare(b);
            }
        };
        this.tokenFn = (arr) => arr.sort(this.tokenSortFunction).join(this.tokenJoining);
        this.evKey = (ev) => {
            console.log(ev, ev.key);

            let result = ev.key.length == 1 || ev.key.toLowerCase() == 'dead' ?
                ev.code.toLowerCase().replace('key', '').replace('digit', '') :
                ev.key.toLowerCase();
            that.console(ev.type, ev, result);
            return result;
        };

        window.addEventListener('keydown', function (ev) {
            if (typeof ev.key == 'undefined') { return false; }
            let k = that.evKey(ev);

            /*ignore start */
            if (that.ignoreDict.includes(k)) {
                that.console('ignore ' + k);
                that.ignore = true;
                that.ignoreList.push(k);
                that.ignoreList = [...new Set(that.ignoreList)];
                return false;
            }

            if (that.ignore == true) {
                that.console('ignore true: ', that.ignoreList);
                return false;
            }
            /*ignore end */


            that.keys.push(k);
            that.keys = [...new Set(that.keys)];

            let hitKeys = that.keys.filter((key) => that.allKeysArr.includes(key)),
                hitToken = that.tokenFn(hitKeys);

            that.console('keydown', '\n\t',
                ev, k, '\n\t',
                hitKeys, hitToken, '\n\t',
                that);

            Object.entries(that.registration).map(o => {
                let [token, setting] = o;
                if (hitToken == token && (!that.waterKeys.includes(k))) {
                    setting.callback(that.keys, ev);
                    that.console('down', token, ' run callback ');
                    if (setting.fireBoolean == false) {
                        // that.keys = that.keys.filter(key => key != k);
                        that.waterKeys.push(k);
                        that.waterKeys = [... new Set(that.waterKeys)];
                        that.console('down, add ', k, ' to ', that.waterKeys, that);
                    }
                }
            });

        });

        window.addEventListener("keyup", function (ev) {
            if (typeof ev.key == 'undefined') { return false; }

            let hitKeys_before = [...that.keys.filter((key) => that.allKeysArr.includes(key))],
                hitToken_before = String(that.tokenFn(hitKeys_before));

            let k = that.evKey(ev);
            that.keys = that.keys.filter((_k) => _k != k);

            /*ignore start */
            if (that.ignoreDict.includes(k)) {
                that.console('ignore release :' + k);

                that.ignoreList = that.ignoreList.filter((_k) => _k != k);

                if (that.ignoreList.length == 0) {
                    that.ignore = false;
                }

                return false;
            }

            if (that.ignore == true) {
                that.console('ignore true: ', that.ignoreList);
                return false;
            }
            /*ignore end */


            let hitKeys_after = [...that.keys.filter((key) => that.allKeysArr.includes(key))],
                hitToken_after = String(that.tokenFn(hitKeys_after));

            that.console('keyup', '\n\t',
                ev, k, '\n\t',
                hitKeys_before, hitToken_before, '\n\t',
                hitKeys_after, hitToken_after, '\n\t',
                that);


            Object.entries(that.registration).map(o => {

                let [token, setting] = o;

                if (hitToken_before == token &&
                    hitKeys_before != hitToken_after
                ) {

                    if (typeof setting.releaseCallback === 'function') {
                        that.console('up', token, 'run release callback');
                        setting.releaseCallback(that.keys, ev);
                    }



                }

                if (setting.fireBoolean == false &&
                    that.waterKeys.includes(k) &&
                    setting.keysArr.includes(k)
                ) {
                    that.waterKeys = that.waterKeys.filter(key => key != k);
                    that.console('up, remove ', k, ' from ', that.waterKeys, that);
                }

            });
        });
    }

    registerIgnore() {
        [...arguments].map(k => {
            if (typeof k != 'string') {
                console.error('register ignore dict error: ', k, ' is not a string');
                return false;
            }
            this.ignoreDict.push(k);
        });
        this.ignoreDict = [...new Set(this.ignoreDict)];
    };

    register(keysArr, callback, releaseCallback = () => { }, fireBoolean = false, coverBoo = false) {
        keysArr = [...new Set(keysArr)];
        const keyToken = this.tokenFn(keysArr);
        this.allKeysArr.push(...keysArr);
        this.allKeysArr = [...new Set(this.allKeysArr)];

        let keysTocken = this.tokenFn(keysArr);
        if (!(keysTocken in this.registration) || coverBoo == true) {
            this.registration[keysTocken] = {
                'keysArr': keysArr,
                'callback': callback,
                'releaseCallback': releaseCallback,
                'fireBoolean': fireBoolean
            };
        } else {
            this.console.error(`${keysArr} has been registered: ${this.registration[keysTocken]}`);
        }
    };
    coverRegister(keysArr, callback, releaseCallback = () => { }, fireBoolean = false) {
        register(keysArr, callback, releaseCallback, fireBoolean, coverBoo = true);
    }

}

// const m = new multiKeys();
// m.registerIgnore('control', 'meta');
// m.register(['alt', 'a'],
//     () => {
//         console.log('a')
//     },
//     () => {
//         console.log('release a')
//     },
//     false);

// m.register(['alt', 'b'],
//     () => {
//         console.log('b')
//     },
//     () => {
//         console.log('release b')
//     },
//     true);

// by leizingyiu