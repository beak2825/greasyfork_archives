// ==UserScript==
// @name             fetlife_all_members (ASL+role+status filter)
// @namespace        io.github.bewam
// @description      greasemonkey script to filter fetlife members when it's possible. Search by name, gender, role, age, location or status.
// @include          https://fetlife.com/*
// @version          1.9.2.20180609
// @run-at           document-end
// @include-jquery   false
// @use-greasemonkey true
// @require          http://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/2198/fetlife_all_members%20%28ASL%2Brole%2Bstatus%20filter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/2198/fetlife_all_members%20%28ASL%2Brole%2Bstatus%20filter%29.meta.js
// ==/UserScript==

// NOTE: comment (change first "/**/" to "/*") for debugging.
console = { log: ()=>{}}; /**/

var useCurrentPageAsDefault = false;
var onlyWithAvatar = false; //actual default see #4 on github

/* care modifing
 * TODO : to be removed: https://greasyfork.org/fr/forum/discussion/4199/lock-a-script#latest
 */
const FETCH_LATENCY = 2000;
// jshint ignore: start

const forceNoAvatar = true;// see #4 on github du to fetlife restriction + ajax

+(function ($) {
    // jshint ignore: end
    // jquery str
    const Selector = {
        currentPage: 'em.current',
        body: 'body',
        users: 'div.fl-member-card',
        pagination: "div.pagination",
        nextPage: 'a.next_page',
        nextDisabled: 'span.next_page.disabled',
        previousPage: 'a.previous_page',
        firstUser: '.fl-member-card:first',
        user: {
            body: '.fl-flag__body',
            imageAvatar: 'img.fl-avatar__img',
            firstSpan: '.fl-member-card__user',
            profileLink: 'a.fl-member-card__user',
            shortDesc: '.fl-member-card__info',
            /** age, gender, role */
            location: 'span.fl-member-card__location',
            into: 'span.fl-member-card__action span',
        }
    };
    // script_name avoid name/id conflicts
    const _STR = 'fetlife_all_members';
    const ARRAY_GENDER = [
        'M',
        'F',
        'NB',
        'GQ',
        'GF',
        'TG',
        'MtF',
        'FtM',
        'CD/TV',
        'IS',
        'FEM',
        'B',
        'N/A'
    ];
    const ARRAY_GENDER_LABEL = [
        'Male',
        'Female',
        'Non-Binary',
        'Genderqueer',
        'Gender Fluid',
        'Transgender',
        'Trans - Male to Female',
        'Trans - Female to Male',
        'Crossdresser/Transvestite',
        'Intersex',
        'Femme',
        'Butch',
        'Not Applicable'
    ];
    const ARRAY_ROLE = [
        'Dominant',
        'Domme',
        'Switch',
        'submissive',
        'Master',
        'Mistress',
        'slave',
        'kajira',
        'kajirus',
        'Top',
        'Bottom',
        'Sadist',
        'Masochist',
        'Sadomasochist',
        'Disciplinarian',
        'Kinkster',
        'Fetishist',
        'Swinger',
        'Hedonist',
        'Sensualist',
        'Exhibitionist',
        'Voyeur',
        'Daddy',
        'Mommy',
        'babygirl',
        'babyboy',
        'Ageplayer',
        'Little',
        'Middle',
        'Big',
        'Brat',
        'Princess',
        'Slut',
        'Doll',
        'Toy',
        'Cougar',
        'Bull',
        'Hotwife',
        'Cuckoldress',
        'cuckold',
        'cuckquean',
        'sissy',
        'Furry',
        'pet',
        'kitten',
        'pup',
        'pony',
        'Handler',
        'Primal',
        'Primal Predator',
        'Primal Prey',
        'Spanko',
        'Spanker',
        'Spankee',
        'Rigger',
        'Rope Top',
        'Rope Bottom',
        'Rope Bunny',
        'Leatherman',
        'Leatherwoman',
        'Leather Daddy',
        'Leather Mommy',
        'Leather Top',
        'Leather bottom',
        'Leatherboy',
        'Leathergirl',
        'Leatherboi',
        'Bootblack',
        'Drag King',
        'Drag Queen',
        'Evolving',
        'Exploring',
        'Vanilla',
        'Undecided',
        'Not Applicable'
    ];
    const ARRAY_ROLE_LABEL = ARRAY_ROLE;
    const ARRAY_INTO_STATUS = [
        'is into',
        'is curious about'
    ];
    const ARRAY_INTO_ACTIVITY = [
        'giving',
        'receiving',
        'watching',
        'wearing',
        'watching others wear',
        'everything to do with it'
    ];

    const marker = {
        folded: '&gt;',
        unfolded: 'v'
    };
    const isFetishesPage = /^\/fetishes/.test(location.pathname);
    const imageMissingData =
        `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`;
    // NOTE: do not modify unless you know what you're doing.
    var overlay = (form) =>
        $(Selector.firstUser)
        .parents('.clearfix:first')
        .prepend(form)
        .length;

    /** TODO @class to manage pages */
    // Pagination = {
    //     _next: '',
    //     _previous: '',
    //     _currentNo: '',
    //     _clientPageNo,
    //     setNext: setNext,
    //     getNext: getNext,
    //     getPrevious :()  => this._previous,
    //     setPrevious : (str) => {this._previous = str;},
    //     getCurrentNo: () => this._currentNo ,
    //     setCurrentNo: (n) => {this._currentNo = n;},
    // };
    // var page = Object.create(Pagination);

    var lastPageNumber,
        _pageCurrentNo,
        _clientPageNo,
        InputcurrentPageDefaultVal,
        _fromPage = -1,
        _toPage = -1,
        pageMin = 1,
        pageMax = 1,
        _pageNext = '';

    /* balance columns */
    var alternColumn = 0,
        _shownCount = 0;

    /* store user html block index is shared with mCache */
    /** NOTE  see initUserCache() for desc. */
    var mCache = [],
        /** referrer (pages) */
        rCache = [],
        /** image avatar data */
        aCache = [],
        listContainers = [] // columns where lists appear
    ;
    //TODO Expressions =
    var userRegExp = new RegExp('([0-9]{2})(' + ARRAY_GENDER.join('|') +
        ')? (' +
        ARRAY_ROLE.join('|') + ')?', 'i');
    var regInto = new RegExp('^(' + ARRAY_INTO_STATUS.join('|') +
        ') ?(.*$)?');

    /** modified, value, default value */
    var filters = {
        'NameContains': [false, '', ''],
        'AgeMin': [false, '', ''],
        'AgeMax': [false, '', ''],
        'Gender': [false, [], []],
        'Role': [false, [], []],
        'LocContains': [false, '', ''],
        'IntoStatus': [false, '', ''],
        'IntoActivity': [false, '', '']
        // has_avatar: @see function
    };

    var ajaxLocked = false,
        scriptLaunched = false,
        stopped = false;

    /* jshint ignore:start */
    addStyle(
        '#' + S('Wrapper') + ' { ' +
        //     'background-color: rgba(255, 255, 255, 0.4);' +
        'border: solid 2px lightgray;' +
        'color: white !important;/**/ ' +
        'padding:5px;' +
        'min-height:15px !important;' +
        'vertical-align:middle;' +
        'margin-bottom: 10px;' +
        '} ' +
        '#' + S('Controls') + ' { ' +
        'display: block;/**/ ' +
        'min-height:15px !important;' +
        '}' +
        '#' + S('Content') + ' { ' +
        'display: none;/**/ ' +
        'margin-top: 5px;' +
        '}' +
        '#' + S('Buttons') + '{ ' +
        'margin-top: 10px;' +
        '}' +
        '#' + S('ButtonStop') + '{ ' +
        // 'display: none;' +
        '}' +
        `.flfm-has-avatar{
            border: solid 1px red;
        }`
    );
    /* jshint ignore:end */

    /*-----------------------------------*/

    /*----------------html related--------------------------*/
    function buildOptions(arr1, arr2) {
        var str = '';
        $.each(arr1, function (i, v) {
            str += '<option value="' + v + '" >' + arr2[i] +
                '        </option>';
        });
        return str;
    }

    function addStyle(css) {
        var newStyleSheet = document.createElement('style');
        document.body.appendChild(newStyleSheet);
        newStyleSheet.textContent = css;

        return newStyleSheet;
    }

    function drawBlock() {
        var optionsGender = buildOptions(ARRAY_GENDER, ARRAY_GENDER_LABEL);
        var optionsRole = buildOptions(ARRAY_ROLE, ARRAY_ROLE_LABEL);
        var optionsIntoStatus = buildOptions(ARRAY_INTO_STATUS,
            ARRAY_INTO_STATUS);
        var optionsIntoActivity = buildOptions(ARRAY_INTO_ACTIVITY,
            ARRAY_INTO_ACTIVITY);

        var BLOCK =
            '<div id="' + S('Wrapper') + '"> ' +
            '    <div id="' + S('Controls') + '">' +
            '        <b>&gt;</b>&nbsp;' +
            '        <u>filter members</u>' +
            '    </div>' +
            '    <div id="' + S('Content') + '"> ' +
            '    <div id="' + S('Filters') + '">' +
            '        <label for="' + S('NameContains') +
            '">name:&nbsp;&nbsp;&nbsp; </label>' +
            '        <input id="' + S('NameContains') +
            '" type="text" class="filter"></input>' +
            '        <br />' +
            '        <label for="' + S('LocContains') +
            '">location:</label>' +
            '        <input id="' + S('LocContains') +
            '" type="text" class="filter" ></input>' +
            '        <br />' +
            '        <u>age</u>&nbsp;' +
            '        <label for="' + S('AgeMin') + '">min:</label>' +
            '        <input id="' + S('AgeMin') +
            '" type="text" class="filter" size="2"></input>' +
            '&nbsp; ' +
            '        <label for="' + S('AgeMax') + '">max:</label>' +
            '        <input id="' + S('AgeMax') +
            '" type="text" class="filter" size="2"></input>' +
            '        <br />' +
            '        <small>' +
            '        Use CTRL key to multiple select.' +
            '        <br />' +
            '        Use MAJ key to do a range select.' +
            '        </small>' +
            '        <br />' +
            '        <label for="' + S('Gender') + '">gender:</label>' +
            '        <select id="' + S('Gender') +
            '" class="filter" name="gender" multiple="multiple" size="3">' +
            '        <option value="" selected="selected">none specified</option>' +
            optionsGender +
            '        </select>' +
            '        <label for="' + S('Role') + '">role:</label>' +
            '        <select id="' + S('Role') +
            '" class="filter" name="role" multiple="multiple" size="5">' +
            '        <option value="" selected="selected">none specified</option>' +
            optionsRole +
            '        </select>';

        if(isFetishesPage) {
            BLOCK +=
                '&nbsp; Into &nbsp;' +
                '        <select id="' + S('IntoStatus') +
                '"  multiple="multiple" size="3">' +
                '        <option value="" selected="selected">All</option>' +
                optionsIntoStatus +
                '        </select>' +
                '        <select id="' + S('IntoActivity') +
                '" multiple="multiple" size="3">' +
                '        <option value="" selected="selected">All</option>' +
                optionsIntoActivity +
                '        </select>';
        }

        BLOCK +=
            '        <br />' +
            // '        <input type="hidden" name="' + S('HasAvatar') +
            // '" ></input>' +
            '        <input type="checkbox" id="' + S('HasAvatar') +
            '" name="' + S(
                'HasAvatar') + '" ' + (onlyWithAvatar ? 'checked="true"' :
                'false') + '></input>' +
            '        <label for="' + S('HasAvatar') +
            '">only with avatar</label>' +
            '        <br />' +
            '        <label for="' + S('FromPage') +
            '">From page:&nbsp;</label>' +
            '        <input id="' + S('FromPage') +
            '" type="text" class="filter" size="3" value="' +
            InputcurrentPageDefaultVal + '"></input>' +
            '        <input id="' + S('ButtonCurrentPage') +
            '" type="button" value="current"></input>' +
            '        <label for="' + S('ToPage') +
            '"> &nbsp;to page:&nbsp;</label>' +
            '        <input id="' + S('ToPage') + '" name="' + S('ToPage') +
            '" type="text" class="filter" size="3"></input>' +
            '        <br />' +
            '        <br />' +
            '    </div> ' + // Filters
            '    <div id="' + S('Buttons') + '" style="display:inline;">' +
            '        <input id="' + S('ButtonGo') +
            '" type="button" value="view&nbsp;all"></input>' +
            '        <input id="' + S('ButtonStop') +
            '" type="button" value="&nbsp;stop&nbsp;" disabled="true"></input>' +
            '    </div>' + // Buttons
            '    <div id="' + S('Info') + '">' +
            '        <br />' +
            '        <span id="' + S('ShowCount') + '">' +
            '        </span> ' +
            '    </div> ' + // Info
            '    </div> ' + //Content
            '</div>'; // Wrapper
        if(overlay(BLOCK) < 1) {
            $(Selector.body)
                .prepend(BLOCK);
        }
    }

    function disableAllInput() {
        // TODO @class Form. Form.disableEntries() => void()
        $I('Content')
            .find('*')
            .attr("disabled", 'true');
        $I('ButtonStop')
            .removeAttr("disabled");
    }

    function enableAllInput() {
        $I('Content')
            .find('*')
            .removeAttr("disabled");
        $I('ButtonStop')
            .attr("disabled", 'true');
    }

    function disableInput() {
        // TODO @function Form.disableEntries() => void()
        $I('Content')
            .find('*')
            .attr("disabled", 'true');
    }

    function enableInput() {
        $I('Content')
            .find('*')
            .removeAttr("disabled");
    }
    /**
     * @param str id
     * @return object jQuery with the tagged (script name) id
     */
    function $I(id) {
        var str = arguments.length > 1 ? arguments[1] : '';
        return $('#' + S(id) + str);
    }

    function S(name) {
        return _STR + name;
    }

    function rS(str) {
        return str.replace(_STR, '');
    }

    function cleanPage() {
        $(Selector.users)
            .remove();
        $(Selector.pagination)
            .hide();
        _shownCount = 0;
    }

    function toggleMarker($el) {
        var cnt = $el.html();
        $el.html(cnt == marker.unfolded ? marker.folded : marker.unfolded);
    }
    /*-----------------------------------*/
    /** Would grab 2 containers where to put members in */
    function initContainers(pageUsers) {
        var parent;
        $(pageUsers)
            .each(function () {
                parent = $(this)
                    .parent()
                    .get(0);
                console.log("container: " + $(parent)
                    .attr("class"));

                if($.inArray(parent, listContainers) == -1) {
                    listContainers.push(parent);
                }
            });
    }
    /*------------------------------------*/
    function updateMemberFilters() {
        $I('Content')
            .find('select, input[type=text]')
            .each(function () {

                var name = rS($(this)
                    .attr('id'));
                console.log('updating filter: ' + name);
                if(!filters[name]) {
                    return;
                }
                if(typeof filters[name][2] != 'string') {
                    var options = $(this)
                        .find('option:selected');
                    filters[name][0] = false;
                    filters[name][1] = [];
                    $(options)
                        .each(function () {
                            filters[name][0] = true;
                            filters[name][1].push($(this)
                                .val());
                        });
                    if(filters[name][1].length == 1 && filters[name][1]
                    [0] === '') {
                        filters[name][0] = false;
                    }
                } else
                if(filters[name][2] != $(this)
                    .val()) {
                    filters[name][0] = true;
                    filters[name][1] = $(this)
                        .val();
                } else {
                    filters[name][0] = false;
                    filters[name][1] = filters[name][2];
                }
            });
        console.log(filters);
    }

    function updateAvatarFilter() {
        onlyWithAvatar = ($I('HasAvatar', ':checked')
            .length > 0);
    }

    function updatePaginationFilters() {
        var reload = false;
        var $fromPage = parseInt($I('FromPage')
            .val());
        var $toPage = parseInt($I('ToPage')
            .val());


        if(_fromPage != $fromPage) {
            _fromPage = $fromPage;
            reload = true;
        }

        if(_toPage != $toPage) {
            _toPage = $toPage;
            reload = true;
        }

        console.log(' _fromPage ' + _fromPage + ' $fromPage ' + $fromPage);
        console.log(' _toPage   ' + _toPage + '   $toPage   ' + $toPage);

        return reload;
    }
    /*-----------------------------------*/
    var Refining = function (cacheItem) {

        var c = cacheItem;
        var filtered = false;

        /**
         * @return bool false by default, element is not trapped */
        this.isFiltered = function () {
            // NOTE for debug purpose uncomment the second block and / comment this one.
            // TODO how secure is eval() ?
            /**
            role();
            name();
            location();
            hasAvatar();
            gender();
            ageMin();
            ageMax();
            intoStatus();
            intoActivity();
            /**/

            /**/
            var functions = [
                "ageMax",
                "ageMin",
                "gender",
                "hasAvatar",
                "intoActivity",
                "intoStatus",
                "location",
                "name",
                "role"
            ];
            for(var fn of functions) {
                // jshint ignore : start
                eval(fn + '()');
                // jshint ignore : end
                if(getF()) {
                    console.log('is filtered: ' + fn.toString());
                    console.log(c);
                    // stop filtering here
                    return true;
                }
            }
            /**/
            return filtered;
        };
        /**
         * @arg boolean filtered ?
         *  @return void(0)
         */
        function setF(F) {
            if(F) {
                filtered = true;
            }
        }

        function getF() {
            return filtered;
        }

        /** NOTE Each filter (except hasAvatar) check if filter was modified
            (updateMemberFilters) and look if the changes concern the current
            user. Filter must set false if ok.
        */

        function ageMax() {
            if(filters.AgeMax[0]) {
                setF(c[1] > parseInt(filters.AgeMax[1]));
            }
        }

        function ageMin() {
            if(filters.AgeMin[0]) {
                setF(c[1] < parseInt(filters.AgeMin[1]));
            }
        }

        function gender() {
            if(filters.Gender[0]) {
                setF($.inArray(c[2], filters.Gender[1]) < 0);
            }
        }

        function hasAvatar() {
            // console.log('avatar ' + onlyWithAvatar.toString());
            setF((onlyWithAvatar && !c[6]) ? true : false);
        }

        function intoActivity() {
            if(filters.IntoActivity[0]) {
                setF($.inArray(c[8], filters.IntoActivity[1]) < 0);
            }
        }

        function intoStatus() {
            if(filters.IntoStatus[0]) {
                setF($.inArray(c[7], filters.IntoStatus[1]) < 0);
            }
        }

        function location() {
            if(filters.LocContains[0]) {
                setF(
                    c[4].toLowerCase()
                    .indexOf(
                        filters.LocContains[1].toLowerCase()
                    ) < 0
                );
            }
        }

        function name() {
            if(filters.NameContains[0]) {
                setF(
                    c[0].toLowerCase()
                    .indexOf(
                        filters.NameContains[1].toLowerCase()
                    ) < 0
                );
            }
        }

        function role() {
            if(filters.Role[0]) {
                setF($.inArray(c[3], filters.Role[1]) < 0);
            }
        }
    }; // Filter

    /** filter each user */
    function filterUser(n) {
        // console.log('filtering n°' + n);
        var o;
        var filter = new Refining(mCache[n]);

        return(filter.isFiltered());

    }
    /*-----------Ajax & pagination -----------------*/
    /** @param mixed (str or jQ.), a link "next" in pagination */
    function setNext(mix) {
        console.log('setNext: ');
        console.log(mix);
        var next = '';
        if(mix.nodeName === 'A') {
            next = mix.href;
        } else if(typeof mix == 'string') {
            next = mix;
        } else if(
            (typeof mix == 'function' ||
                typeof mix == 'object') &&
            $(mix)
            .is('A')
        ) {
            next = mix.attr('href');
        }
        _pageNext = next;
        return(next);
    }

    function getNext() {
        console.log(_pageNext);
        if(_pageNext === '' || _pageNext.match(/^\s*$/)) {
            return '';
        }
        if(_pageNext.indexOf("fetlife.com") < 0) {
            return 'https://fetlife.com/' + _pageNext;
        } else {
            return _pageNext;
        }
    }

    function getCurrentPageNo() {
        return parseInt($(Selector.currentPage)
            .text());
    }

    function getLastPageNum() {
        var $e = $(Selector.nextPage);
        if($e.length > 0) {
            return parseInt($e.prev()
                .text());
        }
        $e = $(Selector.nextDisabled);
        if($e.length > 0) {
            return parseInt($e.prev()
                .text());
        }
        return -1;
    }

    function isLastFetchedPage(next) {
        var p = next.lastIndexOf('?');
        var search;
        var S;
        if(p > -1) {
            // url.search W/o leading ?
            search = next.substr(p + 1);
        } else {
            // no url.search, stop now
            // TODO throw warning
            return true;
        }
        S = search.split('&');
        for(var i = 0; i < S.length; i++) {
            if(S[i].substr(0, 5) === 'page=') {
                return(parseInt(S[i].substr(5)) >= parseInt(_toPage) + 1);
            }
        }
        // unknown case, stop now
        // TODO throw warning
        return true;
    }

    function addUrlString(url, pageNb) {
        var S = location.search.toString();
        console.log('location.search: ' + S);
        if(S.length <= 0) {
            return url + "?page=" + pageNb;
        }
        if(S.indexOf('page=') > -1) {
            return url.replace(/page=\d+/, 'page=' + pageNb);
        } else
            return url + '&page=' + pageNb;
        // FIXME: return what ? return (url + '&page=' + pageNb);
    }

    function fetchMembers(startPageNo) {

        // if (typeof startPageNo === 'undefined')
        //     seekingEnded();

        var next;

        if(startPageNo) {
            console.log('start fetching from Page: ' + startPageNo);
            if(parseInt(startPageNo) > 0) {
                setNext(addUrlString(location.href, startPageNo));
            }
        } else {
            startPageNo = false;
        }

        next = getNext();
        console.log("trying to fetch: " + next);

        if(
            next === '' ||
            next.match(/^\s*$/) ||
            next === void(0)
        ) {
            seekingEnded();
            return;
        }

        if(!ajaxLocked) {
            ajaxLocked = true;
            $.ajax({
                url: next,
                dataType: 'html',
                useCache: false,
                success: (data) => {
                    var pageIndex = storePage(next)
                    onMembersPage(data, pageIndex);
                },
                error: function (event) {
                    seekingEnded();
                    console.error(event);
                }
            });
        }
        showCount();
    }

    function onMembersPage(data, pIndex) {
        var aNext = $(data)
            .find(Selector.nextPage);

        setNext(aNext);

        console.log("next page to fetch: " +
            getNext());
        var users = $(data)
            .find(Selector.users);

        $.each(users, (i, user) => {
            var cacheIndex = initUserCache();
            mCache[cacheIndex][9] = pIndex;
            show(storeUser(cacheIndex, user));
        });

        if(!stopped && !isLastFetchedPage(getNext())) {
            setTimeout(
                function () {
                    ajaxLocked = false;
                    fetchMembers(false);
                }, (FETCH_LATENCY < 0 ? FETCH_LATENCY : 0)
            );
        } else {
            seekingEnded();
        }
    }

    function storePage(url) {
        return(rCache.push(url) - 1);
    }

    function storeAvatar(src, userIndex) {

        var C = mCache[userIndex];
        var referrer = rCache[C[9]];


        if(! C[6]) {
            console.log('user "', C[0], '" has no avatar');
            aCache[userIndex] = false;
            return;
        }

        $.ajax({
                url: src,
                type: "GET",
                headers: {
                    "X-Alt-Referer": referrer
                },
                crossDomain: true,
                xhrFields: {
                    withCredentials: true,
                    // responseType: 'blob'
                },
                success: function (data) {
                    aCache[userIndex] = btoa(data);

                    imgData = getAvatarData(userIndex);
                    $('body')
                        .prepend('img')
                        .attr('src', imgData)
                },
                error: function (event) {
                    seekingEnded();
                    console.error(event);
                }
            })
            .done(function () {
                console.log("img success");
            })
            .fail(function () {
                console.log("img error");
            })
            .always(function () {
                console.log("img complete");
            });
    }

    function showInfo(str) {
        $I('ShowCount')
            .html(str);
    }

    function showCount() {
        showInfo("members: " + _shownCount + " of " + mCache.length);
    }

    function show(n) {
        var html;
        if(!filterUser(n)) {
            html = drawMemberCard(n)
            $(listContainers[alternColumn])
                .append(html)
            // console.log(html);
            _shownCount++;
            alternColumn = (alternColumn == (listContainers.length - 1)) ?
                0 : (
                    alternColumn + 1);
        }
    }

    function drawMemberCard(userIndex) {
        /* 0:name, 1:age, 2:gender, 3:role, 4:location, 5:profileURL, 6:hasAvatar, 7:status, 8:activity */
        var C = mCache[userIndex];
        var avatar = getAvatarData(userIndex);
        var name = C[0];
        var age = C[1];
        var gender = C[2];
        var role = C[3];
        var location = C[4];
        var profileURL = C[5];
        var hasAvatarClass = C[6] ? 'flfm-has-avatar':'';
        var status = C[7];
        var activity = C[8];
        var memberCardHTML =
            `<div class="fl-member-card fl-flag">
        <div class="fl-flag__image ${hasAvatarClass}">
          <a class="fl-avatar__link" href="${profileURL}">
          <img alt="${name}" title="${name}" class="fl-avatar__img" src="${avatar}" width="73" height="73"></a>
        </div>
        <div class="fl-flag__body">
          <a class="fl-member-card__user" href="${profileURL}">${name}</a>
          <span class="fl-member-card__info">
            ${age}${gender}
            ${role}
          </span>
          <span class="fl-member-card__location">
            ${location}
          </span>`;
        memberCardHTML += isFetishesPage ?
            `
              <div class="fl-member-card__action">
          
              <span class="quiet small">
                ${status} ${activity}
              </span>
              </div>` :
            '';
        memberCardHTML += `</div>
      </div>`;
        return memberCardHTML;
    }
    // TODO for 2.0
    // var Cache  = function () {}
    //
    // var Member = function () {
    //
    //     htmlCache = [];
    //
    //
    //     var isfilter = function (n) { Refining.isFiltered()}
    //     var store = function () {};
    //
    //     this.add = function () {};
    //     this.show = function () {};
    //     this.get = function (n) {};
    //
    //     return this;
    // };
    /**
        0:name, 1:age, 2:gender, 3:role, 4:location, 5:profileURL, 6:hasAvatar, 7:status, 8:activity, 9(internal): pageCacheIndex 
    **/
    function initUserCache() {
        var defaults = ['', 0, '', '', '', '', false, '', '', -1];
        var cacheLen = mCache.push(defaults);
        var userIndex = cacheLen - 1;
        return userIndex;
    }

    function getAvatarData(userIndex) {
        var data = imageMissingData;

        if(mCache[userIndex][6]) {
            data = aCache[userIndex];
        }
        return "data:image/jpg;base64," + data;
    }

    function storeUser(cacheIndex, userData) {

        var matches = [];
        var firstSpan = $(userData)
            .find(Selector.user.firstSpan);
        var C, into, src;
        var $avatar = $(userData)
            .find(Selector.user.imageAvatar);

        C = mCache[cacheIndex];

        /* name */
        C[0] = firstSpan.text();
        /** profile url */
        C[5] = $(userData)
            .find(Selector.user.profileLink)
            .attr('href');

        src = $avatar.attr('src')
        console.log(src);

        /** hasAvatar, need to be false if user has */
        if(src.indexOf('/images/avatar_missing') < 0 ) {
            C[6] = true;
            if (! forceNoAvatar  ) {
                storeAvatar(src, cacheIndex);
            }
        };
        try {
            var shortDesc = $(userData)
                .find(Selector.user.shortDesc)
                .text()
                .replace(/\n|\r/g, ' ')
                .replace(/\s{1,}|\n|\r/g, ' ');
            console.log(shortDesc)
            var matches = shortDesc.match(userRegExp);

            if(matches.length < 2) {
                return;
            }
            /* age */
            C[1] = matches[1] || '';
            /* gender */
            C[2] = matches[2] || '';
            /* role */
            C[3] = matches[3] || '';
            /* location*/
            C[4] = $(userData)
                .find(Selector.user.location)
                .text() || '';
            /* into */
            if(isFetishesPage) {
                matches = []; /* match: ["into status", "rest aka into activity" ] */
                into = $(userData)
                    .find(Selector.user.into)
                    .text() || '';
                // console.log('into: ' + into);
                matches = into.match(regInto);
                // console.log(matches);
                if(matches) {
                    C[7] = matches[1] || '';
                    C[8] = matches[2] || '';
                }
                //     console.log("mCache[i][7] = "+C[7]+"  &&  mCache[i][8] = "+C[8])
            }
        } catch(err) {
            console.log(err.message);
            throw(new Error(err.message));
        }
        console.log(C);
        return cacheIndex;
    }

    function initCaches() {
        // referrer data to get avatars
        rCache = [];
        // avatars DATA
        aCache = [];
        // members
        mCache = [];
    }

    function clearCache() {
        // referrer data to get avatars
        rCache = [];
        // avatars DATA
        aCache = [];
        // members
        mCache = [];
    }

    function gC(n) {
        return mCache[n];
    }

    function getCache(n) {
        return gC(n);
    }
    /*--------------helpers---------------*/
    function isInt(n) {
        return(!isNaN(n));
    }

    /*--------------Actions--------------*/
    function init() {
        var $pageNext = $(Selector.nextPage);
        var $previousPage = $(Selector.previousPage);
        var $pageUsers = $(Selector.users);
        var $fromPage = $I('FromPage');

        /** next_page link and list of members are on current page ? go on */
        if(($pageNext.length > 0 || $previousPage.length > 0) &&
            $pageUsers.length > 0
        ) {
            _clientPageNo = _pageCurrentNo = getCurrentPageNo();
            initContainers($pageUsers);

            console.log('_pageCurrentNo :' + _pageCurrentNo);

            drawBlock();
            $I('FromPage')
                .val(
                    useCurrentPageAsDefault ?
                    _pageCurrentNo :
                    1
                );
            pageMax = lastPageNumber = getLastPageNum();
            console.log("lastPageNumber: " + lastPageNumber);
            $I('ToPage')
                .val(lastPageNumber);
            setNext($pageNext);
            initListener();
        }
    }

    function showFilterAgain() {

        $I('ButtonGo')
            .val("filter again");
        enableAllInput();

        $I('ButtonGo')
            .bind('click', () => {
                if(updatePaginationFilters()) {
                    launchAgain();
                    $(this)
                        .unbind('click');
                } else {
                    filterAgain();
                }
            });
    }

    function initListener() {
        $I('Controls')
            .click(function () {
                $I('Content')
                    .toggle("slow");
                toggleMarker($(this)
                    .find('b:first'));
            });
        $I('ButtonCurrentPage')
            .click(function () {
                $I('FromPage')
                    .val(_pageCurrentNo);
            });
        $I('ButtonGo')
            .click(function () {
                $(this)
                    .unbind('click');
                launchSearch();

            });
        $I('ButtonStop')
            .click(function () {
                // $(this).unbind('click');
                stopped = true;
            });
    }

    function launchSearch() {
        if(!scriptLaunched) {
            updatePaginationFilters();
            console.log("_fromPage: " + _fromPage);
            console.log("_toPage: " + _toPage);
            showInfo("loading ...");
            updateMemberFilters();
            updateAvatarFilter();
            cleanPage();
            disableAllInput();
            fetchMembers(_fromPage);
            scriptLaunched = true;
        }
    }

    function launchAgain() {
        cleanPage();
        clearCache();
        scriptLaunched = false;
        launchSearch();
    }

    function filterAgain() {
        alternColumn = 0;
        // window.scrollTo(0, 0);
        updateMemberFilters();
        updateAvatarFilter();
        cleanPage();
        for(var i = 0; i < mCache.length; i++) {
            show(i);
        }
        showCount();
    }
    /** due to recursive function*/
    function seekingEnded() {
        console.log("total members: " + mCache.length);
        ajaxLocked = false;
        stopped = false;
        enableAllInput();
        showFilterAgain();
        showCount();
    }
    /* jshint ignore:start */
    var count = 0;
    if(typeof $ == 'function') {
        init();
    } else {
        setTimeout(function () {
            if(typeof $ !== 'function') {
                alert('fetlife is modified, script ' +
                    GM_info.script.name +
                    'can\'t run please contact the author.');
            }
        }, 3000);
    }
    /*-----------------------------------*/
})(jQuery);
jQuery.noConflict(true);
/* jshint ignore:end */
