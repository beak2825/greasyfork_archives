    // ==UserScript==
    // @name            camamba-utils
    // @name:de         camamba-utils
    // @namespace       dannysaurus.camamba
    // @version         0.4.1
    // @license         MIT License
    // @connect         camamba.com
    // @grant           GM_xmlhttpRequest
    // @grant           GM_getValue
    // @grant           GM_setValue
    // @require         https://greasyfork.org/scripts/22752-object-utils/code/object-utils.js
    // @require         https://greasyfork.org/scripts/20131-html-utils/code/html-utils.js
    // @description     utils for modifying the DOM and fetching info of a webpage of camamba
    // @description:de  utils for modifying the DOM and fetching info of a webpage of camamba
    // ==/UserScript==

    var LIB = LIB || {};
    /**
     * @type {{ButtonSmall, ButtonTiny, SelectUsers, pageInfo, User, veewards, UserSearch}}
     */
    LIB.camambaUtils = (function(){
        var objUtils = LIB.objectUtils;
        var htmlUtils = LIB.htmlUtils;
        /**
         * Wrapper for a 'button' html Element.
         * The initial class attribute is <code>class='smallbutton'</code>.
         * @param {function} [callback] - The callback function for the <code>onClick<code> event
         * @param {string} [text] - The content text of the element (text shown on the button)
         * @param {string} [id] - The value for the <code>id</code> attribute
         * @constructor
         */
        function ButtonSmall(callback, text, id) {
            if (!(this instanceof ButtonSmall)) {
                return new ButtonSmall(callback, text, id);
            }
            htmlUtils.Button.call(this, 'smallbutton', callback, text, id);
        }
        objUtils.extend(ButtonSmall).from(htmlUtils.Button);

        /**
         * Wrapper for a 'button' html Element.
         * The initial class attribute is <code>class='tinybutton'</code>.
         * @param {function} [callback] - The callback function for the <code>onClick<code> event
         * @param {string} [text] - The content text of the element (text shown on the button)
         * @param {string} [id] - The value for the <code>id</code> attribute
         * @constructor
         */
        function ButtonTiny(callback, text, id) {
            if (!(this instanceof ButtonTiny)) {
                return new ButtonTiny(callback, text, id);
            }
            htmlUtils.Button.call(this, 'tinybutton', callback, text, id);
            this.domElement.style = 'margin:0;padding:0;width:auto;';
        }
        objUtils.extend(ButtonTiny).from(htmlUtils.Button);


        /**
         * Wrapper for a 'Select' html element for selecting camamba users.
         * The options will be generated from the list of users.
         * The initial class attribute is <code>class='smallselect'</code>.
         * @param {Object<string, User>[]} users - The list of users shown as options
         * @param {boolean} [isShowGivenNames] - <code>true</code> has options shown from the custom name if given instead of the camamba username
         * @param {function} [callback] - callback function triggered by the events <code>OnChange</code>, <code>OnFocus</code> and <code>KeyUp</code>
         * @param {string} [id] - The value for the <code>id</code> attribute
         * @constructor
         */
        function SelectUsers(users, isShowGivenNames, callback, id) {
            if (!(this instanceof SelectUsers)) {
                return new SelectUsers(users, isShowGivenNames, callback, id);
            }
            htmlUtils.Select.call(this, "smallselect", callback, id);
            Object.defineProperties(this, {
                /**
                 * list of users of type {{uid:User}}
                 */
                users: {
                    get: function () { return users; },
                    set: function (value) {
                        users = value;
                        SelectUsers.prototype.updateOptions.call(this);
                    },
                    enumerable: true, configurable: true
                },
                /**
                 * <code>true</code> shows the custom given names
                 * <code>false</code> shows the camamba names
                 */
                isShowGivenNames: {
                    get: function () { return isShowGivenNames; },
                    set: function (value) {
                        var booleanValue = !!value;
                        if (booleanValue !== keeper.get(_idx).isShowGivenNames) {
                            isShowGivenNames = booleanValue;
                            SelectUsers.prototype.updateOptions.call(this);
                        }
                    },
                    enumerable: true, configurable: true
                }
            });
            SelectUsers.prototype.updateOptions.call(this);
        }
        SelectUsers.prototype = {
            constructor: SelectUsers,
            /**
             * Recreates the options from the current list of users.
             */
            updateOptions: function() {
                var sortUsers = [];
                var remainingUsers = {};
                for (var i = 0; i <= this.domElement.length - 1; i++) {
                    var userInSelect = this.domElement[i].user;
                    if (userInSelect) {
                        if (!this.users[userInSelect.uid]) { // deleted users
                            this.domElement.remove(i);
                        } else { // remaining users
                            remainingUsers[userInSelect.uid] = true;
                            sortUsers.push({user: userInSelect, selected: this.domElement[i].selected});
                        }
                    }
                }
                Object.keys(this.users).forEach(function(uid) {
                    if (!remainingUsers[uid]) { // additional users
                        var user = users[uid];
                        sortUsers.push({user: user, selected: false});
                        /**
                         * Html 'Option' Child of a Html 'Select' Element that holds a User
                         * @type {HTMLOptionElement}
                         * @property {User} user - The User related to the option
                         */
                        this.domElement.add(document.createElement('OPTION'));
                    }
                }, this);
                this.domElement.length = sortUsers.length;
                var optionTextProp = _isShowGivenNames ? "name" : "uname";
                sortUsers.sort(function (a, b) {
                    var nameA = a.user[optionTextProp].toLowerCase();
                    var nameB = b.user[optionTextProp].toLowerCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
                sortUsers.forEach(function (opt, i) {
                    this.domElement[i].text = opt.user[optionTextProp];
                    this.domElement[i].value = opt.user.uid;
                    this.domElement[i].user = opt.user;
                    this.domElement[i].selected = opt.selected;
                }, this);
                // refresh select
                this.domElement.value = this.domElement.options[this.domElement.selectedIndex].value;
            },
            /**
             * Returns the user of the selected option
             * @returns {User} The current selected user
             */
            getSelectedUser: function() {
                return this.domElement.options[this.domElement.selectedIndex].user;
            }
        };

        var pageInfo = (function(){
            var isInGerman = location.hostname.indexOf("de.camamba.com") >= 0;
            var urlRoute = (function() {
                var route = /^\/(.+?)(?:_de)?\.php.*/g.exec(location.pathname);
                return route && route.length >= 2 ? route[1] : "";
            })();
            /**
             * Verifies an url, if it loads the German version of camamba.
             * @param {string} url The url for a camamba Page.
             * @returns {boolean} <code>true</code> if the url will request a camamba Page in German.
             */
            var urlIsGerman = function (url) {
                return (url.indexOf('www.de.camamba.com') >= 0);
            };
            /**
             * Transforms the url of a camamba Page to whether English or German forced.
             * @param {string} url - The url for a cammaba Page.
             * @param {Object.<string,string>[]} [queryParamsObj] - A key-value Object for additional query parameter to be attached to the url.
             * @param {boolean} [isResultInGerman] - <code>true</code> results a German-forced url, <code>false</code> results English forced.
             * @returns {string} The localized url
             */
            var urlLocalized = function (url, queryParamsObj, isResultInGerman) {
                var localizedUri = url;
                if (typeof isResultInGerman === "undefined") { isResultInGerman = isInGerman; }
                if (isResultInGerman && !urlIsGerman(url)) {
                    localizedUri = url
                        .replace("www.camamba.com", "www.de.camamba.com")
                        .replace(".php", "_de.php");
                } else if (!isResultInGerman && urlIsGerman(url)) {
                    localizedUri = url
                        .replace("www.de.camamba.com", "www.camamba.com")
                        .replace("_de.php", "php");
                }
                var queryParams = '';
                if (queryParamsObj) {
                    var hasParams = url.indexOf('.php?') >= 1;
                    Object.keys(queryParamsObj).forEach(function (key) {
                        var sep = (hasParams ? '&' : '?');
                        var value = queryParamsObj[key];
                        queryParams += sep + key + '=' + value;
                        hasParams = true;
                    });
                }
                return localizedUri + queryParams;
            };
            return {
                isInGerman: isInGerman,
                route: urlRoute,
                urlLocalized: urlLocalized
            };
        })();


        var userDataStore = {}; //uid:userData
        var userDataDefaultEntry = function() { return {
            uid: Number.NaN, uname: "", name: "", note: "", age: Number.NaN, gender: "",
            isPremium: null, isReal: null, isSuper: null,
            location: { distanceInKm: Number.NaN, gps: "", place: "" },
            online: { isOnlineNow: false, lastSeen: new Date("invalid") },
            room: { roomId: "", roomName: "" },
            lastUpdated: new Date("invalid"),
            lastChanged: new Date("invalid")
        }};
        /**
         * Represents a camamba user.
         * Intitially it tries to load the User from the database with the given uid.
         * @constructor
         * @param {string|number} uid - the users camamba uid.
         */
        function User(uid) {
            if (!(this instanceof User)) {
                return new User(uid);
            }

            var thisUser = this;
            var backingData = userDataStore[uid] = objUtils.BackingData(this, userDataDefaultEntry(), "uid" + uid, function(oldValue, newValue) {
                backingData.lastUpdated = Date.now();
                if (newValue != oldValue) {
                    backingData.lastChanged = backingData.lastUpdated;
                    thisUser.isDirty = true;
                }
            });
            backingData.uid = parseInt(uid,10);
            this.load();
        }
        User.prototype = {
            /**
             * Saves or updates the user in the database of this script.
             * Overwrites an existing entry or creates a new entry if it doesn't already exist.
             */
            save: function() {
                userDataStore[this.uid].save();
                this.isDirty = false;
            },
            /**
             * Loads the User from the database of this script.
             * @returns {Boolean} <code>true</code> if the user was found and could be successfully loaded from db
             */
            load: function() {
                var isSuccess = userDataStore[this.uid].load();
                if (isSuccess) {
                    this.isDirty = false;
                }
                return isSuccess;
            },
            /**
             * Removes the User from the database of this script.
             */
            remove: function() {
                userDataStore[this.uid].remove();
                this.isDirty = true;
            },
            /**
             * Gets all users stored from the database determined for this Script.
             * @returns {{}<string|number,User>[]} List with all Stored Users
             */
            loadAllUsers: function() {
                var users = {};
                var storedKeys = GM_listValues();
                for (var i = 0; i <= storedKeys.length - 1; i++) {
                    var key = storedKeys[i].toString();
                    if (key.indexOf('uid') === 0) {
                        var uid = key.substr(3);
                        users[uid] = new User(uid);
                    }
                }
                return users;
            },
            /**
             * Has the browser open the profile Page of this user.
             * @param {boolean} [asNewTab=false]
             *      <code>true</code>, Page is opened in a new tab.
             *      <code>false</code>, replaces the current Page.
             */
            openProfilePage: function(asNewTab) {
                var profPageLocPath = location.protocol + '//www.camamba.com/profile_view.php';
                var queryParamsObj = {uid: this.uid, m: 'start'};
                var uri = Page.localizeUri(profPageLocPath, queryParamsObj);
                var target = asNewTab ? '_blank' : '_self';
                window.open(uri, target);
            }
        };

        /**
         * Represents the veewards
         * @type {{lol, drama, banHammer, cheese}}
         */
        var veewards = (function() {
            function Vee(idx, name) {
                this.index = idx;
                this.name = name;
            }

            /**
             * This callback is displayed as part of the Requester class.
             * @callback VeeSendCallback
             * @param {Date} timeSend - Time the veeward beeing send
             */

            /**
             * Tries to send a veeward.
             * @param {User|number} [user] - The user or uid to whom the veeward may be send
             * @param {number} [coolDownPeriodSec] - Period in seconds for which no veeward will be send since last sent
             * @param {VeeSendCallback} [callback] - A function to be called when the veeward got tried to be send.
             */
            Vee.prototype.send = function(user, coolDownPeriodSec, callback) {
                if (typeof user === "number") {
                    user = new User(user);
                } else if (!(user instanceof User)) {
                    user = new User(602175);
                }
                coolDownPeriodSec = parseInt(coolDownPeriodSec || 0, 10);
                if (typeof callback !== 'function') {
                    var thisVee = this;
                    callback = function(now) {
                        console.info(new Date(now * 1000), 'try to veeward ', user.name, ' with ', thisVee.name);
                    };
                }

                var now = function() {
                    var now = Date.now ? Date.now() : new Date().getTime();
                    return Math.floor(now / 1000);
                }();
                var lastVeeTime = GM_getValue('autoVeeTimestamp', 0);
                if (lastVeeTime > now || lastVeeTime + coolDownPeriodSec < now) {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: '/extras/setdata.php',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        onreadystatechange: function() {
                            GM_setValue('autoVeeTimestamp', now);
                            callback(now);
                        },
                        data: 'sendvee=' + this.index + '&to=' + user.uid
                    });
                }
            };

            return {
                lol: new Vee(1, 'LoL'),
                drama: new Vee(2, 'Drama'),
                banHammer: new Vee(3, 'Ban Hammer'),
                cheese: new Vee(4, 'Cheese')
            };
        })();

        /**
         * Represents a search using the page "/search.php".
         * @constructor
         */
        var UserSearch = (function() {
            var doSearch = function(paramString, callback, startPageNr, maxPageNr) {
                var result = {};
                if (paramString.length > 1 && paramString.charAt(paramString.length - 1) !== '&') {
                    paramString += "&";
                }
                startPageNr = startPageNr || 0;
                maxPageNr = maxPageNr || Number.POSITIVE_INFINITY;
                var pageNr = startPageNr;
                if (pageNr > maxPageNr) {
                    return;
                }

                var searchHref = '/search.php?' + paramString;
                htmlUtils.requestPageAsync(searchHref + '&sortreg=1&page=' + pageNr, function(resp) {
                    console.log(searchHref + 'page=' + pageNr);
                    var elTablesNormal = resp.html.getElementsByClassName('searchNormal');
                    var elTablesSuper = resp.html.getElementsByClassName('searchSuper');
                    var timeStampInMs = Date.now();
                    [elTablesNormal, elTablesSuper].forEach(function(userTables, index) {
                        var uIsSuper = index === 1;
                        [].forEach.call(userTables, function(table) {
                            var user, uId, uName, uGender, uAge, uIsPremium, uIsReal,
                                uLocation = {},
                                uOnline = { isOnlineNow: true, lastSeen: timeStampInMs },
                                uRegDate = new Date(0);
                            var links = table.getElementsByTagName('a');
                            for (var i = 0; i <= links.length - 1; i++) {
                                var link = links[i];
                                if (!uId) {
                                    var uidSearch = /javascript:sendMail\('(.+)'\)/g.exec(link.href);
                                    if (uidSearch && uidSearch.length >= 2) {
                                        uId = uidSearch[1];
                                        uIsPremium = uIsReal = false;
                                        if (link.nextSibling && link.nextSibling.nextSibling && link.nextSibling.nextSibling.nextSibling) {
                                            var elPremiumReal = link.nextSibling.nextSibling.nextSibling;
                                            if (elPremiumReal) {
                                                if (elPremiumReal.getAttribute('href') === '/premium.php') {
                                                    uIsPremium = true;
                                                    if (elPremiumReal.nextSibling && elPremiumReal.nextSibling.nextSibling) {
                                                        elPremiumReal = elPremiumReal.nextSibling.nextSibling;
                                                    }
                                                }
                                            }
                                            if (elPremiumReal && elPremiumReal.getAttribute('src') === '/gfx/real.png') {
                                                uIsReal = true;
                                            }
                                        }
                                    }
                                }
                                if (!uName || !uGender) {
                                    var unameSearch = /javascript:openProfile\('(.+)'\)/g.exec(link.href);
                                    if (unameSearch && unameSearch.length >= 2) {
                                        uName = unameSearch[1];
                                        if (link.nextSibling && link.nextSibling.nextSibling) {
                                            var genderAgeSearch = link.nextSibling.nextSibling.textContent;
                                            var uGenderSearch = /(male|female|couple)/g.exec(genderAgeSearch);
                                            if (uGenderSearch && uGenderSearch.length >= 2) {
                                                uGender = uGenderSearch[1];
                                                var uAgeTxt = genderAgeSearch.replace(/\D/g, "");
                                                if (uAgeTxt) {
                                                    uAge = parseInt(uAgeTxt);
                                                }
                                            }
                                        }
                                    }
                                }
                                if (!uLocation.gps) {
                                    var locationSearch = /javascript:openMap\((.+)\)/g.exec(link.href);
                                    if (locationSearch && locationSearch.length >= 2) {
                                        uLocation = {
                                            gps: locationSearch[1],
                                            place: link.innerHTML
                                        };
                                        var distanceTxt = link.nextSibling.textContent.replace(/\D/g, "");
                                        if (distanceTxt) {
                                            uLocation.distanceInKm = parseInt(distanceTxt);
                                        }
                                    }
                                }
                            }

                            var reRegDate = /(\d{2})\.(\d{2})\.(\d{4})\s(\d{2}):(\d{1,2}):(\d{2})/;

                            var roomResult = new RegExp(/Online\snow\sin\s([A-Za-z\s]+?[A-Za-z])/.source + reRegDate.source).exec(table.textContent);
                            if (!roomResult) {
                                // private room
                                roomResult = new RegExp(/Online\snow\sin\s(p\d{0,9})/.source + reRegDate.source).exec(table.textContent);
                            }
                            if (roomResult && roomResult.length >= 2) {
                                uOnline.roomName = roomResult[1];
                            }
                            var regDateResult = reRegDate.exec(table.textContent);
                            if (regDateResult && regDateResult.length >= 7) {
                                var regDateDay = regDateResult[1];
                                var regDateMonth = regDateResult[2];
                                var regDateYear = regDateResult[3];
                                var regDateHour = regDateResult[4];
                                var regDateMinute = regDateResult[5];
                                var regDateSecond = regDateResult[6];
                                uRegDate = new Date(regDateYear, regDateMonth - 1, regDateDay, regDateHour, regDateMinute, regDateSecond);
                            }

                            if (uId) {
                                user = new User(uId);
                                if (uAge) {
                                    user.age = uAge;
                                }
                                if (uGender) {
                                    user.gender = uGender;
                                }
                                user.isPremium = uIsPremium;
                                user.isReal = uIsReal;
                                user.isSuper = uIsSuper;
                                if (uLocation.distanceInKm !== undefined) {
                                    user.location.distanceInKm = uLocation.distanceInKm;
                                }
                                if (uLocation.gps) {
                                    user.location.gps = uLocation.gps;
                                }
                                if (uLocation.place) {
                                    user.location.place = uLocation.place;
                                }
                                if (uName) {
                                    user.uname = uName;
                                }
                                if (uOnline.isOnlineNow) {
                                    user.online.isOnlineNow = uOnline.isOnlineNow;
                                }
                                if (uOnline.lastSeen) {
                                    user.online.lastSeen = uOnline.lastSeen;
                                }
                                if (uOnline.roomId) {
                                    user.online.roomId = uOnline.roomId;
                                }
                                if (uOnline.roomName) {
                                    user.online.roomName = uOnline.roomName;
                                }
                                if (uRegDate) {
                                    user.regDate = uRegDate;
                                }
                                result[uId] = user;
                            }
                        }, this); // userTable
                    }, this); // elTableNormal, elTableSuper
                    var links = resp.html.getElementsByTagName('a');
                    pageNr++;
                    var isLastPage = true;
                    for (var i = links.length - 1; i >= links.length - 10; i--) {
                        var linkHref = links[i].getAttribute('href');
                        if (linkHref && linkHref.toLowerCase().indexOf(searchHref + "page=" + pageNr) >= 0) {
                            if (pageNr <= maxPageNr) {
                                setTimeout(function(onlineUsers) {
                                    doSearch(paramString, callback, pageNr, maxPageNr);
                                }, 125);
                                isLastPage = false;
                            }
                            break;
                        }
                    }
                    callback(result, isLastPage);
                });
            };

            /** @typedef {{MALE: string, FEMALE: string, ANY: string}} GendersType */
            /**
             * @readonly
             * @enum {string}
             * @type {GendersType}
             */
            function ParamsUserSearch(nick, gender, isOnline, hasPicture, isPremium, isReal, isSuper) {
                if (!(this instanceof ParamsUserSearch)) {
                    return new ParamsUserSearch(nick, gender, isOnline, hasPicture, isPremium, isReal, isSuper);
                }
                var paramsObj = {};
                var paramEqualsOneIfSet = function(queryParamName) {
                    return { configurable: true, enumerable: true,
                        get: function() { return paramsObj[queryParamName]; },
                        set: function(value) {
                            if (value) { paramsObj[queryParamName] = 1; }
                            else { delete paramsObj[queryParamName]; }
                        }
                    }
                };

                Object.defineProperties(this, {
                    nick: { configurable: true, enumerable: true,
                        get: function() { return paramsObj.nick; },
                        set: function(value) { paramsObj.nick = value || ""; }
                    },
                    gender: { configurable: true, enumerable: true,
                        get: function() { return paramsObj.gender; },
                        set: function(value) { paramsObj.gender = value || ParamsUserSearch.prototype.genders.ANY; }
                    },
                    isOnline: paramEqualsOneIfSet("online"),
                    hasPicture: paramEqualsOneIfSet("picture"),
                    isPremium: paramEqualsOneIfSet("isprem"),
                    isReal: paramEqualsOneIfSet("isreal"),
                    isSuper: paramEqualsOneIfSet("issuper")
                });

                this.nick = nick;
                this.gender = gender;
                this.isOnline = isOnline;
                this.hasPicture = hasPicture;
                this.isPremium = isPremium;
                this.isReal = isReal;
                this.isSuper = isSuper;
                htmlUtils.Params.call(this, paramsObj);
            }
            ParamsUserSearch.prototype.genders = { MALE: "male", FEMALE: "female", COUPLE: "couple", ANY: "any" };
            Object.freeze(ParamsUserSearch.prototype.genders);
            objUtils.extend(ParamsUserSearch).from(htmlUtils.Params);

            /**
             * Represents a search using the page "/search.php".
             * The parameters restrict the search ...
             * @param {string} [nick] - to users whose username to start with a given string
             * @param {GendersType} [gender=any] - to users with a given gender
             * @param {boolean} [isOnline=true] - to users currently online
             * @param {boolean} [isReal=false] - to users with a real tag
             * @param {boolean} [hasPicture=false] - to users with a picture uploaded to their profile
             * @param {boolean} [isPremium=false] - to users with premium
             * @param {boolean} [isSuper=false] - to users with super premium
             * @constructor
             */
            var Constructor = function (nick, gender, isOnline, isReal, hasPicture, isPremium, isSuper) {
                gender = gender || ParamsUserSearch.prototype.genders.ANY;
                isOnline |= (typeof isOnline === "undefined");
                /**
                 * parameter restricting the results of the search
                 * @type {ParamsUserSearch}
                 */
                this.queryObject = new ParamsUserSearch(nick, gender, isOnline, hasPicture, isPremium, isReal, isSuper);
                /**
                 * List with users resulting from the last executed search
                 * @type {{}<string|number,User>[]}
                 */
                this.users = {};
            };
            Constructor.prototype = {
                constructor: Constructor,
                /**
                 * Executes the search, runs callback when finished
                 * @param callback the callback function that gets the result as list of users
                 */
                execute: function(callback) {
                    var that = this;
                    doSearch(this.queryObject.toString(), function(users, isLastPage){
                        that.users = users;
                        if (typeof callback === "function") {
                            callback(users, isLastPage);
                        }
                    }, 0);
                }
            };
            return Constructor;
        })();

        return {
            ButtonSmall: ButtonSmall,
            ButtonTiny: ButtonTiny,
            SelectUsers: SelectUsers,
            pageInfo: pageInfo,
            User: User,
            veewards: veewards,
            UserSearch: UserSearch
        };
    })();