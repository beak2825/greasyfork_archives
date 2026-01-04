// ==UserScript==
// @name            Ron Paul Curriculum Mods
// @locale          English (en)
// @namespace       COMDSPDSA
// @version         5
// @description     Fixing what I can for RPC
// @author          Dan Overlander
// @include         https://www.ronpaulcurriculum.com/*
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=848794
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require	        https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require         https://greasyfork.org/scripts/40055-libraryjquerygrowl/code/libraryJQueryGrowl.js
// @require         https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js
// @resource        BootstrapCSS https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/410219/Ron%20Paul%20Curriculum%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/410219/Ron%20Paul%20Curriculum%20Mods.meta.js
// ==/UserScript==

// Since v04: Minor typo catching.  Another "due at the end of the week" ignore added.  Null check for $('p a').eq(link).attr('href')
// Since v03: Added class-page-level resource menu. Added scraping and copying-for-Google-Classroom.
// Since v02: Updated Forums
// Since v01: Updated library url.  Added video background.  Added ability to remove / substract names from list (if added, then injected randomly).  Shows list count for a few seconds at startup.
// Since v00: initial script following aria assistant template


(function() {
    'use strict';

    var utils = {
        debug: function (msg) {
            if (global.prefs.debugMode) {
                tm.log(msg);
            }
        },
        substrToEnd: function (str, chk) {
            if (!str || !chk) {
                return;
            }
            var idx = str.lastIndexOf(chk) + chk.length;
            return str.substr(idx, str.length - idx);
        },
        initScript: function () {
            _.each(global.constants.initalizeOnElements, (trigger) => {
                tm.getContainer({
                    'el': trigger,
                    'max': 100,
                    'spd': 1000
                }).then(function($container){
                    page.initialize();
                });
            });
        },
        renderAudioElement: function(snd) {
            var baseUrl = 'https://www.dorkforce.com/dsa/themes/',
                body,
                el;
            body = document.getElementsByTagName('body')[0];
            if (!body) { return; }
            el = document.createElement('audio');
            el.id = snd.split('.')[0];
            el.src = baseUrl + 'audio/' + snd;
            el.autostart = 'false';
            body.appendChild(el);
        },
        getUrl: function() {
            var pathArray = document.URL.split( '/' );
            var protocol = pathArray[0];
            var host = pathArray[2];
            var url = protocol + '//' + host;
            return url;
        },
        addEvent: function(el, ev, func) {
            if (el.addEventListener) {
                el.addEventListener(ev, func, false);
            } else if (el.attachEvent) {
                el.attachEvent("on" + ev, func);
            } else {
                el["on"+ev] = func; // Note that this line does not stack events. You must write you own stacker if you don't want overwrite the last event added of the same type. Btw, if you are going to have only one function for each event this is perfectly fine.
            }
        },
        rnd: () => {
            return Math.floor(Math.random() * 999999999) + 1;
        },
        flickerElement: ($el) => {
            setTimeout(() => {
                if ($el != null) {
                    $el.addClass('iClicked');
                    setTimeout(() => {
                        $el.removeClass('iClicked');
                    }, 150);
                }
            }, 150);
        },
        announce: function (theMessage) {
            if (global.prefs.debugMode) tm.log(theMessage);
            var randomNum = utils.rnd();
            $('body').prepend('<span style="position:absolute; left:-1000px; width:0;" role="alert" id="ariaRemoved' + randomNum + '">' + theMessage + '</span>');
            $.growl.notice({
                message: theMessage,
                size: 'medium'
            });
            window.setTimeout(() => {
                $('#ariaRemoved' + randomNum).remove();
            }, 5000);
        },
        getLessonId: function (source) {
            var dashIndex = source.lastIndexOf('/') + 1;
            var lessonId = source.substr(dashIndex, source.length - dashIndex).replace('.cfm', '');
            return lessonId;
        }
    };

    var global =
        {
            constants: {
                TIMEOUT: 250,
                initalizeOnElements: ['body']
            },
            ids: {
                scriptName: 'RPCMods',
                prefsName: 'RPCPrefs',
                memsName: 'RPCMems'
            },
            states: {
                isMouseMoved: true,
                areButtonsAdded: false,
                areKeysAdded: false,
                areClassesAdded: false
            },
            prefs: {},
            mems: {},
            templates: {
                avatars: [
                    {
                        'host': 'robohash',
                        "url": '<img src="https://robohash.org/IDVAL?set=set4&size=50x50" class="forumAvatar" />'
                    },
                    {
                        'host': 'dicebear',
                        "url": '<img src="https://avatars.dicebear.com/api/avataaars/IDVAL.svg?skin[]=yellow" class="forumAvatar" />'
                    }
                ]
            }
        },
        page = {
            initialize: function () {
                setTimeout(function () {
                    page.setPrefs();
                    page.setMems();
                    tm.setTamperIcon(global);
                    tm.addClasses();
                    page.addClasses();
                    page.addElements();
                    page.addIndicies();
                    page.addKeys();
                    page.fixBreadcrumbs();
                    page.fixForums();
                    setTimeout(page.scrape, 1000);
                }, global.constants.TIMEOUT);
            },
            setPrefs: function() {
                var currentPrefs = GM_getValue(global.ids.prefsName),
                    setDefaultPrefs = function() {
                        // * * * * * DEFINE DEFAULT PREFERENCES HERE * * * * * //
                        if (global.prefs.debugMode == null) global.prefs.debugMode = false;
                        if (global.prefs.schoolData == null) global.prefs.schoolData = [];
                        if (global.prefs.avatar == null) global.prefs.avatar = 'dicebear';
                        if (global.prefs.scrapeOn == null) global.prefs.scrapeOn = false;
                        if (global.prefs.copyOn == null) global.prefs.copyOn = false;
                        if (global.prefs.scrapeIndex == null) global.prefs.scrapeIndex = 0;
                        if (global.prefs.scrapes == null) global.prefs.scrapes = [];
                    };
                if (currentPrefs == null || _.isEmpty(JSON.parse(currentPrefs))) {
                    global.prefs = {};
                    setDefaultPrefs();
                    tm.savePreferences(global.ids.prefsName, global.prefs);
                } else {
                    global.prefs = JSON.parse(currentPrefs);
                    setDefaultPrefs();
                    for (var key in global.prefs) {
                        try {
                            if (global.prefs[key] === 'true' || global.prefs[key] === 'false') {
                                global.prefs[key] = (global.prefs[key] == 'true')
                            } else {
                                global.prefs[key] = JSON.parse(global.prefs[key]);
                            }
                        } catch (e) {
                            global.prefs[key] = global.prefs[key];
                        }
                    }
                }
            },
            setMems: function() {
                var currentMems = GM_getValue(global.ids.memsName);
                if (currentMems == null || _.isEmpty(JSON.parse(currentMems))) {
                    global.mems = {};
                    // * * * * * DEFINE DEFAULT MEMORY HERE * * * * * //
                    global.mems.readList = [];
                    tm.savePreferences(global.ids.memsName, global.mems);
                } else {
                    global.mems = JSON.parse(currentMems);
                }
            },
            addClasses: function () {
                if (!global.states.areClassesAdded) {
                    global.states.areClassesAdded = true;
                    tm.addGlobalStyle(".fingery {margin:0;}");
                    tm.addGlobalStyle('.iClicked { background-color: firebrick !important; }');
                    if (!global.prefs.scrapeOn) {
                        tm.addGlobalStyle('.mgtitle a img { background: url("https://www.picsum.photos/1300/200") !important; background-size: cover; width:100%; max-height:120px; }'); // https://www.picsum.photos/id/818/1300/200
                    }
                    tm.addGlobalStyle(
                        'body { margin:0; }' +
                        'iframe { width:100%; height:500px; }' +
                        '.mgcontainer { max-width: 1282px; }' +
                        '.mgcontentcontainer { padding:0.4rem 1.4rem }' +
                        '.mgheader { overflow: visible; }' +
                        '.mgheaderwidget, .mgmenu { background: cornflowerblue; }' +
                        '.mgnavpanel, .mgleftcontainer, .mgrightcontainer { background: cornflowerblue; }' +
                        '.mgtop .mgnavpanel li a { color: white !important; font-size:1rem !important; }' +
                        '.topnav { margin-left:30%; }' +
                        '.topnav .nav-item { margin-right:1rem; }' +
                        '.topnavspacerchar { display:none; }' +
                        '.mgsubtopnav { background:steelblue; }' +
                        '.catheaderimg { padding: 0.6rem 0.3rem; text-align: center; font-weight: bold; background: gold !important; text-transform:uppercase; }' +
                        '.rpTitle { font-family: "Sigmar One", cursive;, sans-serif; position:absolute; padding:1rem; font-size:4rem; letter-spacing:0.2rem; text-shadow:2px 2px 2px #CCCCCC; }' +
                        '#classlings li { float:left; list-style:none; text-align:center; margin-right:0.625rem; line-height:4rem; margin-bottom:0.625rem; overflow:hidden; } ' +
                        '#classlings li a { text-decoration:none; width:7rem; height:3.7rem; font-size:0.8rem; text-transform:capitalize; }' +
                        '.classPageTitle { text-transform:capitalize; }' +
                        '.rebootItemMenu { border:0; width:100%; }' +
                        '.dropdown-submenu{position:relative;}' +
                        '.dropdown-submenu>.dropdown-menu{top:0;left:100%;margin-top:-6px;margin-left:-1px;-webkit-border-radius:0 6px 6px 6px;-moz-border-radius:0 6px 6px 6px;border-radius:0 6px 6px 6px;}' +
                        '.dropdown-submenu:hover>.dropdown-menu{display:block;}' +
                        '.dropdown-submenu>a:after{display:block;content:" ";float:right;width:0;height:0;border-color:transparent;border-style:solid;border-width:5px 0 5px 5px;border-left-color:#cccccc;margin-top:5px;margin-right:-10px;}' +
                        '.dropdown-submenu:hover>a:after{border-left-color:#ffffff;}' +
                        '.dropdown-submenu.pull-left{float:none;}.dropdown-submenu.pull-left>.dropdown-menu{left:-100%;margin-left:10px;-webkit-border-radius:6px 0 6px 6px;-moz-border-radius:6px 0 6px 6px;border-radius:6px 0 6px 6px;}' +
                        '.customDropdownMenu { display: block; position: static; margin-bottom: 5px; *width: 180px; }' +
                        '.alreadyRead { background:lightgray; }' +
                        '.tippy { font-size:0.6rem; line-height:0.6rem; margin-top:0.1rem; }' +
                        '.forumAvatar { width:50px; height:50px; }'
                    );
                }
            },
            addElements: function() {
                if (global.states.areElementsModified) {
                    return;
                }
                global.states.areElementsModified = true;
                _.each(document.querySelectorAll('.catheaderimg'), function(el) {
                    var thisHeaderTitle = $(el).find('img').attr('alt');
                    $(el).append('<div class="insertedHeader">' + thisHeaderTitle + '</div>');
                    $(el).find('img').remove();
                });

                // Add CSS links
                $('head')
                    .append('<link href="https://fonts.googleapis.com/css2?family=Sigmar+One&display=swap" rel="stylesheet">')
                    .append('<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>');

                // Add page title
                $('.mgheader').prepend('<div class="rpTitle">Ron Paul Curriculum</div>');
                // header buttons
//                 $('.top').addClass('btn');
//                 $('.top[title="Free Trial Courses"]').remove();
//                 $('.top[title="Home"]').parent().after('<li><a class="top btn" href="https://www.ronpaulcurriculum.com/members/main.cfm" title="Classes">Classes</a></li>');
                $('#mgtoppanel').remove();
                // top nav
                $('.topnav').append(`
					<nav class="navbar navbar-expand-sm">
						<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
						    <span class="navbar-toggler-icon"></span>
  						</button>
						<div class="collapse navbar-collapse" id="navbarNavDropdown">
							<ul class="navbar-nav">
								<li class="nav-item active">
									<button class="btn btn-sm btn-primary" onclick="location.href='/'">Home <span class="sr-only">(current)</span></button>
								</li>
								<li class="nav-item dropdown">
									<button class="btn btn-sm btn-primary dropdown-toggle" href="#" id="classesDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Classes</button>
									<div class="dropdown-menu" aria-labelledby="classesDropdown">
										<ul class="dropdown-menu customDropdownMenu" role="menu" aria-labelledby="dropdownMenu">
										</ul>
									</div>
								</li>
								<li class="nav-item">
									<button class="btn btn-sm btn-primary" onclick="location.href='/members/forum/allforums.cfm?forum=65'">Forum</button>
								</li>
								<li class="nav-item">
									<button class="btn btn-sm btn-primary" onclick="location.href='/members/logout.cfm'">Logout</button>
								</li>
							</ul>
						</div>
					</nav>
                `);

                _.each(global.prefs.schoolData, (schDatum) => {
                    $('.customDropdownMenu').append(`
                      <li class="dropdown-submenu">
                        <a class="btn btn-outline-primary rebootItemMenu" tabindex="-1" href="#">Grade ${schDatum.gradeNumber}</a>
                        <ul class="dropdown-menu" id="dropdown_${schDatum.gradeNumber}">
                        </ul>
                    `);
                    _.each(schDatum.classes, (schDClass) => {
                        $('#dropdown_' + schDatum.gradeNumber).append('<li><a class="btn btn-outline-primary rebootItemMenu" href="/members/department58.cfm?s=' + schDClass.classCategory.toLowerCase() + '&g=' + schDatum.gradeNumber + '">' + schDClass.classCategory + '</a></li>');
                    });
                });

                // weird hack to initialize the classes dropdown?
                $('#classesDropdown').click();
                $('#classesDropdown').click();

                // Are we on a class page?  If so, check for resources and insert them
                var lessonId = utils.getLessonId(document.URL);
                var theViewedClass,
                    theViewedLesson,
                    theViewedLessonIndex;
                if (lessonId) {
                    _.each(global.prefs.schoolData, (sdata) => {
                            if (!theViewedClass) {
                                _.each(sdata.classes, (sclass) => {
                                    if (!theViewedLesson) {
                                        theViewedLesson = sclass.classList.find((x) => x.lessonUrl.indexOf('/' + lessonId + '.cfm') > -1);
                                    }
                                    if (theViewedLesson && !theViewedClass) {
                                        theViewedClass = sclass;
                                    }
                                });
                            }
                    });
                    if (theViewedClass) {
                        theViewedLessonIndex = theViewedClass.classList.indexOf(theViewedLesson) + 1;
                        if (theViewedClass.classResources) {
                            $('.lead').after(
                                '<p><a class="btn btn-primary" data-toggle="collapse" href="#collapseResources" role="button" aria-expanded="false" aria-controls="collapseResources">' +
                                '    Resources' +
                                '    </a>' +
                                '</p>' +
                                '<div class="collapse" id="collapseResources">' +
                                '    <div class="card card-body">'
                            );
                            _.each(theViewedClass.classResources, (res) => {
                                if ((res.begin && Number(res.begin) < theViewedLessonIndex) && (!res.end || theViewedLessonIndex < (res.end && Number(res.end)))) {
                                    $('#collapseResources .card').append('<a href="' + res.resourceUrl + '">' + res.resourceName + '</a><br />');
                                }
                            });
                            $('.mgcontent').append(
                                '    </div>' +
                                '</div>'
                            );
                        }
                    }
                }
            },
            addIndicies: function () {
                if (global.prefs.schoolData.length > 0 && $('#classlings').length === 0 && $('.classPageTitle').length === 0 && document.URL.indexOf('department58.cfm') > -1 && document.URL.indexOf('login') < 0) {
                    const urlParams = new URLSearchParams(window.location.search);
                    const qsClassCategory = urlParams.get('s');
                    let qsGrade = urlParams.get('g');
                    if (!qsGrade) {
                        console.info('Grade not understood');
                        return;
                    }
                    qsGrade = Number(qsGrade);
                    let zeClass = global.prefs.schoolData.find((x) => x.gradeNumber === qsGrade).classes.find((x) => x.classCategory.toLowerCase() === qsClassCategory);
                    if (zeClass) {
                        $('.mgcontent').append('<h2 class="classPageTitle">' + qsClassCategory + ': ' + zeClass.className + '</h2>');
                        if (zeClass.classResources) {
                            $('.mgcontent').append(`
                                <p><a class="btn btn-primary" data-toggle="collapse" href="#collapseResources" role="button" aria-expanded="false" aria-controls="collapseResources">
                                    Resources
                                  </a>
                                </p>
                                <div class="collapse" id="collapseResources">
                                  <div class="card card-body">
                            `);
                            _.each(zeClass.classResources, (res) => {
                                $('#collapseResources .card').append('<a href="' + res.resourceUrl + '">' + res.resourceName + '</a><br />');
                            });
                            $('.mgcontent').append(`
                                    </div>
                                </div>
                            `);
                        }
                        $('.mgcontent').append('<ul id="classlings"></ul>');
                        _.each(zeClass.classList, (classling) => {
                            var dashIndex = classling.lessonUrl.lastIndexOf('/') + 1;
                            var lessonId = utils.getLessonId(classling.lessonUrl);
                            var readClass = '';
                            var tippy = '';
                            if (classling.lessonDescription) {
                                tippy = '<div class="tippy">' + classling.lessonDescription + '</div>';
                            }
                            if (global.mems.readList.indexOf(lessonId) > -1) {
                                readClass = 'alreadyRead';
                            }
                            $('#classlings').append('<li>' +
                                                    '<a id="classLink' + lessonId + '" data-lessonid="' + lessonId + '" class="btn btn-outline-primary ' + readClass + '" href="' + classling.lessonUrl + '">' +
                                                    classling.lessonName.toLowerCase() + tippy +
                                                    '</a></li>'
                                                   );
                            $('#classLink' + lessonId).on('click', (e) => {
                                if (global.mems.readList.indexOf(e.target.dataset.lessonid) < 0) {
                                    global.mems.readList.push(e.target.dataset.lessonid);
                                    tm.savePreferences(global.ids.memsName, global.mems);
                                }
                            });
                        });
                    }
                }
            },
            addKeys: function () {
                if (!global.states.areKeysAdded) {
                    global.states.areKeysAdded = true;

//                     $(document).unbind('keyup');
//                     $(document).keyup(function(e) {
//                         if (e.keyCode == 70 && e.ctrlKey && e.altKey) { utils.keys.muteElement(); } // Ctrl-Alt-F
//                         if (e.keyCode == 71 && e.ctrlKey && e.altKey) { utils.keys.muteElement('parent'); } // Ctrl-Alt-G
//                         if (e.keyCode == 35 && e.ctrlKey && e.altKey) { utils.keys.muteElement('hide'); } // Ctrl-Alt-End
//                         if (e.keyCode == 74 && e.ctrlKey && e.altKey) { utils.keys.manageMutes(); } // Ctrl-Alt-J
//                         if (e.keyCode == 85 && e.ctrlKey && e.altKey) { utils.keys.manageMutes('hide'); } // Ctrl-Alt-U
//                         if (e.keyCode == 38 && e.ctrlKey && e.altKey) { utils.keys.selectParent(); } // Ctrl-Alt-Up
//                         if (e.keyCode == 40 && e.ctrlKey && e.altKey) { utils.keys.selectChild(); } // Ctrl-Alt-Down
//                         if (e.keyCode == 37 && e.ctrlKey && e.altKey) { utils.keys.selectPrevSibling(); } // Ctrl-Alt-Left
//                         if (e.keyCode == 39 && e.ctrlKey && e.altKey) { utils.keys.selectNextSibling(); } // Ctrl-Alt-Right
//                         if (e.keyCode == 36 && e.ctrlKey && e.altKey) {
//                             global.states.selectElementMode = !global.states.selectElementMode;
//                             utils.announce('HIDE mode: ' + global.states.selectElementMode);
//                         } // Ctrl-Alt-Home
//                         if (e.keyCode == 27) { utils.keys.closePopup(); } // Esc
//                     });
                }
            },
            fixBreadcrumbs: function () {
                if (global.prefs.schoolData === [] || document.querySelector('.fixedBreadcrumb')) {
                    return;
                }
                $('.backto').addClass('fixedBreadcrumb');
                if (!document.querySelector('.breadcrumbpage a')) {
                    $('.breadcrumbpage').eq(0).html('<a href="#">' + $('.breadcrumbpage').text() + '</a>');
                }
                var currentId = utils.getLessonId(document.URL);
                var gradeData;
                var classData;
                var $backLink;
                var scanClassesId;
                _.each(global.prefs.schoolData, (leGrade) => {
                    _.each(leGrade.classes, (leClass) => {
                        _.each(leClass.classList, (leLesson) => {
                            scanClassesId = utils.getLessonId(leLesson.lessonUrl);
                            if (currentId === scanClassesId) {
                                gradeData = leGrade;
                                classData = leClass;
                            }
                        });
                    });
                });
                if (classData) {
                    $backLink = $('a.backto').eq($('a.backto').length-1);
                    $backLink.attr('href', '/members/department58.cfm?s=' + classData.classCategory.toLowerCase() + '&g=' + gradeData.gradeNumber);
                }
            },
            fixForums: function () {
                const urlParams = new URLSearchParams(window.location.search);
                const qsForum = urlParams.get('forum');
                // const qsThread = urlParams.get('ThreadID') || urlParams.get('threadid');
                const isRows = document.querySelector('.fRow');
                const isRoot = document.querySelector('.mgforumcol2') != null;
                if (!qsForum || isRows) {
                    return;
                }
                const forumContent = isRoot ? {
                    'start': 4,
                    'end': 3
                } : {
                    'start': 3,
                    'end': 1
                }
                tm.addGlobalStyle(
                    '.fRow { padding:0.625rem; border-top:1rem solid aliceblue; display:flex; }' +
                    '.fRowMeta { max-width:6rem; }' +
                    '.fRowBy { margin:0.3rem 0; font-weight:bold; }' +
                    '.fRowTime { font-size: 0.625rem; }' +
                    '.fRowComment { margin-left:2rem; }' +
                    '.fRowComment .mgtablecell, .fRowComment .forum { padding-top:0; margin-top:0; }' +
                    '.fRowBy { width:70px; }' +
                    'a.forum { float:right; }'
                )
                if (isRoot) {
                    tm.addGlobalStyle(
                        '.fRowAvatar { position:relative; left:110px; margin-top:-11px; margin-bottom:-44px; }' +
                        '.fRowComment { position:relative; margin-left:100px; }' +
                        '.fRowReplies { padding-left:20px; }'
                    );
                }
                var $forumTables = isRoot ? $('.mgtablerow') : $('.forumtable'),
                    $forumDesc = $forumTables.eq(0),
                    $forumLinks = $forumTables.eq(1),
                    $threadListing = $forumTables.eq(2),
                    $fRow,
                    rowTime,
                    rowBy,
                    rowByAvatar,
                    rowComment,
                    rowReplyButton,
                    rowReplies,
                    fRows = [],
                    rowPush = function () {
                        fRows.push({
                            "rowTime": rowTime.replace(/ /g, ' '), // what crazy heck is this?
                            "rowBy": rowBy,
                            "rowByAvatar": rowByAvatar,
                            "rowComment": rowComment,
                            "rowReplies": rowReplies,
                            "rowReplyButton": rowReplyButton
                        });
                    };
                for (var intI = forumContent.start; intI < $forumTables.length - forumContent.end; intI++) {
                    $fRow = $forumTables.eq(intI);
                    if (isRoot) {
                        rowTime = $fRow.find('.mgforumcol4').text();
                        var tempTime = rowTime.substr(0, rowTime.indexOf(/(AM|PM)/g)+2);
                        rowTime = rowTime.replace(tempTime, '') + ' ' + tempTime;
                        rowBy = $fRow.find('.mgforumcol2').text();
                        rowByAvatar = global.templates.avatars.find((x) => x.host === global.prefs.avatar).url.replace(/IDVAL/g, rowBy);
                        rowComment = $fRow.find('.mgforumcol1 a').parent().html();
                        rowReplyButton = null;
                        rowReplies = $fRow.find('.mgforumcol3').text();
                        rowPush();
                    } else {
                        if (intI % 2 === 1) { // forum row header
                            rowTime = $fRow.text().match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec).*(AM|PM)/g)[0];
                            rowBy = $fRow.find('b').text();
                            rowByAvatar = global.templates.avatars.find((x) => x.host === global.prefs.avatar).url.replace(/IDVAL/g, rowBy);
                        } else { // forum post content
                            rowComment = $fRow.find('.forummessage').html();
                            rowReplyButton = $fRow.find('a.forum').parent().html()
                            rowPush();
                        }
                    }
                    $fRow.hide();
                }
                fRows = fRows.reverse();
                _.each(fRows, (fRow) => {
                    var $tempRoot = $('.threadlisting').length > 0 ? $('.threadlisting') : $('.mgcontent');
                    $tempRoot.after(`
                        <div class="fRow">
                            <div class="fRowMeta">
                                <div class="fRowAvatar">${fRow.rowByAvatar}</div>
                                <div class="fRowBy">${fRow.rowBy}</div>
                                <div class="fRowTime"><a href="#" title="${fRow.rowTime}">${moment(fRow.rowTime).fromNow()}</a></div>
                            </div>
                            <div class="fRowComment">${fRow.rowComment}${fRow.rowReplyButton ? fRow.rowReplyButton : ''}</div>
                            <div class="fRowReplies">${fRow.rowReplies ? '(' + fRow.rowReplies + ' replies)' : ''}</div>
                        </div>
                    `);
                });
                if (!isRoot) {
                    $('.fRowComment').find('a.forum').addClass('btn btn-primary');
                } else {
                    $('.fRow').eq($('.fRow').length-1).after($forumTables.eq($forumTables.length-2));
                    $('.fRow').eq($('.fRow').length-1).after($forumTables.eq($forumTables.length-3));
                }
            },
            scrape: function () {
                // RPCModsOptions is the ID of the script preferences modal
                if ((!global.prefs.copyOn || document.getElementById('verifyMotches') != null) && (document.getElementById('RPCModsOptions') != null || !global.prefs.scrapeOn || global.prefs.scrapes.length > 3000 || global.prefs.scrapeIndex < 1 || global.prefs.scrapeIndex > 11111 || document.querySelector('.scraped'))) {
                    return;
                }
                $('body').append('<span class="scraped"></span>');

                var pageId = utils.getLessonId(document.URL),
                    leadText = $('.lead').text(),
                    headline = $('.articleheadline').text(),
                    guessClassName = null;
                var motch = {
                    authorGuessed: false,
                    authorName: null,
                    className: null,
                    departmentLink: null,
                    gradeNum: null,
                    lessonId: null,
                    lessonName: null,
                    needsFlash: false,
                    pageId: Number(pageId)
                };
                // Oops; you stopped the process.  Start again on the correct page.
                if (!motch.pageId || motch.pageId === 'NaN') {
                    utils.debug('SCRAPE ERROR. motch.pageId = ' + motch.pageId);
                    return;
                } else if (!global.prefs.copyOn && global.prefs.scrapeIndex > 0 && motch.pageId !== global.prefs.scrapeIndex) {
                    window.location.href = '/members/' + global.prefs.scrapeIndex + '.cfm';
                    return;
                }

                var ords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "twenty-one", "twenty-two", "twenty-three", "twenty-four", "twenty-five", "twenty-six", "twenty-seven", "twenty-eight", "twenty-nine", "thirty", "thirty-one", "thirty-two", "thirty-three", "thirty-four", "thirty-five", "thirty-six", "thirty-seven", "thirty-eight", "thirty-nine", "forty", "forty-one", "forty-two", "forty-three", "forty-four", "forty-five", "forty-six", "forty-seven", "forty-eight", "forty-nine", "fifty", "fifty-one", "fifty-two", "fifty-three", "fifty-four", "fifty-five", "fifty-six", "fifty-seven", "fifty-eight", "fifty-nine", "sixty", "sixty-one", "sixty-two", "sixty-three", "sixty-four", "sixty-five", "sixty-six", "sixty-seven", "sixty-eight", "sixty-nine", "seventy", "seventy-one", "seventy-two", "seventy-three", "seventy-four", "seventy-five", "seventy-six", "seventy-seven", "seventy-eight", "seventy-nine", "eighty", "eighty-one", "eighty-two", "eighty-three", "eighty-four", "eighty-five", "eighty-six", "eighty-seven", "eighty-eight", "eighty-nine", "ninety", "ninety-one", "ninety-two", "ninety-three", "ninety-four", "ninety-five", "ninety-six", "ninety-seven", "ninety-eight", "ninety-nine", "one hundred", "one hundred one", "one hundred two", "one hundred three", "one hundred four", "one hundred five", "one hundred six", "one hundred seven", "one hundred eight", "one hundred nine", "one hundred ten", "one hundred eleven", "one hundred twelve", "one hundred thirteen", "one hundred fourteen", "one hundred fifteen", "one hundred sixteen", "one hundred seventeen", "one hundred eighteen", "one hundred nineteen", "one hundred twenty", "one hundred twenty-one", "one hundred twenty-two", "one hundred twenty-three", "one hundred twenty-four", "one hundred twenty-five", "one hundred twenty-six", "one hundred twenty-seven", "one hundred twenty-eight", "one hundred twenty-nine", "one hundred thirty", "one hundred thirty-one", "one hundred thirty-two", "one hundred thirty-three", "one hundred thirty-four", "one hundred thirty-five", "one hundred thirty-six", "one hundred thirty-seven", "one hundred thirty-eight", "one hundred thirty-nine", "one hundred forty", "one hundred forty-one", "one hundred forty-two", "one hundred forty-three", "one hundred forty-four", "one hundred forty-five", "one hundred forty-six", "one hundred forty-seven", "one hundred forty-eight", "one hundred forty-nine", "one hundred fifty", "one hundred fifty-one", "one hundred fifty-two", "one hundred fifty-three", "one hundred fifty-four", "one hundred fifty-five", "one hundred fifty-six", "one hundred fifty-seven", "one hundred fifty-eight", "one hundred fifty-nine", "one hundred sixty", "one hundred sixty-one", "one hundred sixty-two", "one hundred sixty-three", "one hundred sixty-four", "one hundred sixty-five", "one hundred sixty-six", "one hundred sixty-seven", "one hundred sixty-eight", "one hundred sixty-nine", "one hundred seventy", "one hundred seventy-one", "one hundred seventy-two", "one hundred seventy-three", "one hundred seventy-four", "one hundred seventy-five", "one hundred seventy-six", "one hundred seventy-seven", "one hundred seventy-eight", "one hundred seventy-nine", "one hundred eighty" ];

                /*!
 * Number-To-Words util
 * @version v1.2.4
 * @link https://github.com/marlun78/number-to-words
 * @author Martin Eneqvist (https://github.com/marlun78)
 * @contributors Aleksey Pilyugin (https://github.com/pilyugin),Jeremiah Hall (https://github.com/jeremiahrhall),Adriano Melo (https://github.com/adrianomelo),dmrzn (https://github.com/dmrzn)
 * @license MIT
 */
                !function(){"use strict";var e="object"==typeof self&&self.self===self&&self||"object"==typeof global&&global.global===global&&global||this,t=9007199254740991;function f(e){return!("number"!=typeof e||e!=e||e===1/0||e===-1/0)}function l(e){return"number"==typeof e&&Math.abs(e)<=t}var n=/(hundred|thousand|(m|b|tr|quadr)illion)$/,r=/teen$/,o=/y$/,i=/(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)$/,s={zero:"zeroth",one:"first",two:"second",three:"third",four:"fourth",five:"fifth",six:"sixth",seven:"seventh",eight:"eighth",nine:"ninth",ten:"tenth",eleven:"eleventh",twelve:"twelfth"};function h(e){return n.test(e)||r.test(e)?e+"th":o.test(e)?e.replace(o,"ieth"):i.test(e)?e.replace(i,a):e}function a(e,t){return s[t]}var u=10,d=100,p=1e3,v=1e6,b=1e9,y=1e12,c=1e15,g=9007199254740992,m=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"],w=["zero","ten","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];function x(e,t){var n,r=parseInt(e,10);if(!f(r))throw new TypeError("Not a finite number: "+e+" ("+typeof e+")");if(!l(r))throw new RangeError("Input is not a safe number, it’s either too large or too small.");return n=function e(t){var n,r,o=arguments[1];if(0===t)return o?o.join(" ").replace(/,$/,""):"zero";o||(o=[]);t<0&&(o.push("minus"),t=Math.abs(t));t<20?(n=0,r=m[t]):t<d?(n=t%u,r=w[Math.floor(t/u)],n&&(r+="-"+m[n],n=0)):t<p?(n=t%d,r=e(Math.floor(t/d))+" hundred"):t<v?(n=t%p,r=e(Math.floor(t/p))+" thousand,"):t<b?(n=t%v,r=e(Math.floor(t/v))+" million,"):t<y?(n=t%b,r=e(Math.floor(t/b))+" billion,"):t<c?(n=t%y,r=e(Math.floor(t/y))+" trillion,"):t<=g&&(n=t%c,r=e(Math.floor(t/c))+" quadrillion,");o.push(r);return e(n,o)}(r),t?h(n):n}var M={toOrdinal:function(e){var t=parseInt(e,10);if(!f(t))throw new TypeError("Not a finite number: "+e+" ("+typeof e+")");if(!l(t))throw new RangeError("Input is not a safe number, it’s either too large or too small.");var n=String(t),r=Math.abs(t%100),o=11<=r&&r<=13,i=n.charAt(n.length-1);return n+(o?"th":"1"===i?"st":"2"===i?"nd":"3"===i?"rd":"th")},toWords:x,toWordsOrdinal:function(e){return h(x(e))}};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=M),exports.numberToWords=M):e.numberToWords=M}();

                // fix ordinal numbers
                for (var i = 0; i < 180; i++) {
                    _.each($('p'), (pb) => {
                        if ($(pb).text().indexOf(numberToWords.toWordsOrdinal(i) + ' lesson') > -1 ||
                           $(pb).text().indexOf(numberToWords.toWordsOrdinal(i) + ' class') > -1 ||
                           $(pb).text().indexOf(numberToWords.toWordsOrdinal(i) + ' lecture') > -1) {
                            if (!motch.lessonId) {
                                utils.debug('GOT lessonId from word ordinals');
                                motch.lessonId = i
                            }
                        }
                        if ($(pb).text().indexOf(numberToWords.toOrdinal(i) + ' video') > -1) {
                            if (!motch.lessonId) {
                                utils.debug('GOT lessonId from ordinals');
                                motch.lessonId = i
                            }
                        }
                    });
                }

                if ($('.articlebyline').length === 0) {
                    motch.authorGuessed = true;
                    if ($('.mgcontent:contains("CHEMISTRY")').length > 0) {
                        $('.articleheadline').after('<span class="articlebyline" align="left" style="color:red;">Kevin Poff</span>');
                        utils.debug('GOT gradeNum, className from missing .articlebyline');
                        motch.gradeNum = 11;
                        motch.className = 'Science';

                        if (global.prefs.schoolData) {
                            var gradeDat = global.prefs.schoolData.find((x) => x.gradeNumber === motch.gradeNum);
                            if (gradeDat) {
                                var classDat = gradeDat.classes.find(x => x.classCategory === motch.className);
                                if (classDat) {
                                    utils.debug('GOT lessonId from missing .articlebyline');
                                    motch.lessonId = ords.indexOf(ords[classDat.classList.find(x => x.lessonUrl.indexOf(motch.pageId) > -1).lessonName.replace('Lesson ', '')]);
                                }
                            }
                        }

                        var spaceIndex = $('.mgcontent p').eq(0).text().substr(0, 30).lastIndexOf(' ');
                        utils.debug('GOT lessonName from missing .articlebyline');
                        motch.lessonName = $('.mgcontent p').eq(0).text().substr(0, spaceIndex) + '...';
                    } else {
                        $('.articleheadline').after('<span class="articlebyline" align="left" style="color:red;">Gary North</span>');
                    }
                }
                utils.debug('GOT authorName from ".articlebyline"');
                motch.authorName = $('.articlebyline').text(); // Set author if available
                if (motch.authorName.toLowerCase().indexOf('timothy terrell') > -1) { // map information based on author
                    utils.debug('GOT className, gradeNum from mapping');
                    motch.className = 'Finance';
                    motch.gradeNum = 8;
                }
                if ($('.lead').text().indexOf('esson ') < 0 && $('.lead').next().text().indexOf('esson ') > -1) { // if the "Lesson X" is in the sibling of the '.lead' element, use that
                    leadText = $('.lead').next().text();
                }
                if (leadText.indexOf('esson ') > -1) {
                    if (!motch.lessonId) {
                        try {
                        utils.debug('GOT lessonId from .lead');
                            motch.lessonId = Number(leadText.match(/(lesson|lecture) ([0-9])*\w+/gi)[0].replace(/(lesson|lecture) /gi, ''));
                        } catch (e) {
                            utils.debug('GOT no lessonId from ".lead"');
                        }
                        if (!motch.lessonId) {
                            utils.debug('GOT lessonId from .lead (had to rewrite)');
                            var nextWord = utils.substrToEnd(leadText, 'esson ').trim();
                            if (nextWord.match(/:/g)) {
                                nextWord = nextWord.substr(0, nextWord.indexOf(':'));
                            }
                            motch.lessonId = ords.indexOf(nextWord.toLowerCase());
                            if (motch.lessonId === -1) {
                                utils.debug('GOT to reset lessonId; ords search failed');
                                motch.lessonId = null;
                            }
                        }
                    }
                }
                if (!motch.lessonName && leadText.indexOf(':') > -1 && leadText.indexOf(/(lesson|lecture) ([0-9])*\w+:/gi) < 0) {
                    utils.debug('GOT lessonName from leadText with ":" and "lesson X:"');
                    motch.lessonName = leadText.substr(leadText.indexOf(':')+1, leadText.length - leadText.indexOf(':')+1);
                    motch.lessonName = motch.lessonName.trim();
                    if (motch.lessonName.length > 120 || motch.lessonName === '') {
                        utils.debug('RESET lessonName; too long or empty');
                        motch.lessonName = null;
                    }
                }
                if (leadText.indexOf(' - ') > -1 && !motch.lessonName) {
                    utils.debug('GOT lessonName from leadText " - "');
                    motch.lessonName = leadText.substr(leadText.indexOf(' - ')+3, leadText.length - leadText.indexOf(' - ')+3);
                }
                // fix exceptions in headline
                headline = headline.replace(/1A-/g, 'A - ');
                headline = headline.replace(/1B-/g, 'B - ');
                // analyze the headline
                if (headline.match(/(lesson|lecture) ([0-9])+/gi)) { // if you find "a word"+"a number"
                    if (!motch.lessonId) {
                        utils.debug('GOT lessonId from le headline');
                        motch.lessonId = Number(headline.match(/(lesson|lecture) ([0-9])+/gi)[0].replace(/(lesson|lecture) /gi, ''));
                    }
                    guessClassName = headline.substr(0, headline.indexOf(' '));
                    if (guessClassName.indexOf('esson') < 0) { // the first portion of headline does not contain "Lesson"
                        if (!motch.className) {
                            utils.debug('GOT className from headline that does not contain lesson');
                            motch.className = guessClassName.trim();
                        }
                        if (!motch.gradeNum) {
                            motch.gradeNum = Number(headline.match(/([0-9])+/gi)[0]);
                        }
                    } else { // found Lesson-something in the headline
                        if ($('p:contains("for the PDF worksheet for this lesson")').length > 0) {
                            utils.debug('GOT className from specific paragraph');
                            motch.className = 'History';
                        }
                        utils.debug('GOT lessonId from headline');
                        motch.lessonId = Number(headline.match(/([0-9])+/gi)[0]);
                    }
                }
                // another analyzation of the headline
                if (headline.match(/ - /g) && (!motch.lessonName || motch.className === 'GovA')) {
                    if (headline.indexOf(':') > -1) {
                        utils.debug('GOT lessonId and lessonName from headline');
                        motch.lessonName = headline.substr(headline.indexOf(':')+1, headline.length - headline.indexOf(':')+1);
                        var numberMatch;
                        try {
                            numberMatch = utils.substrToEnd(headline, ' - Lesson ').match(/([0-9])+|(II)|I/g)[0];
                        } catch (e) {
                            utils.debug('...hm, unable to find " - Lesson "');
                        }
                        try {
                            numberMatch = utils.substrToEnd(headline, 'Lesson ').match(/([0-9])+|(II)|I/g)[0];
                        } catch (e) {
                            utils.debug('...rats! no "Lesson " either...');
                        }
                        if (numberMatch === 'I') numberMatch = 1;
                        if (numberMatch === 'II') numberMatch = 2;
                        motch.lessonId = Number(numberMatch);
                    } else {
                        utils.debug('GOT lessonName from headline');
                        motch.lessonName = headline.substr(headline.indexOf(' - ')+3, headline.length - headline.indexOf(' - ')+3);
                    }
                }
                // check headline for Class after Grade X
                if (headline.match(/grade [0-9]+/gi)) {
                    utils.debug('GOT className from headline');
                    motch.className = headline.substr(headline.indexOf(': ')+2, headline.length - headline.indexOf(': '+2)).trim();
                }
                // check headline for "Grade X"
                var headlineGrade = headline.match(/grade [0-9]+/gi)
                if (headlineGrade && !motch.gradeNum) {
                    motch.gradeNum =Number(headline.match(/([0-9])+/gi)[0]);
                }
                // check headline for lessonId in format "Lesson XX"
                if (headline.match(/(lesson|lecture) ([0-9])+/gi) && !motch.lessonId) {
                    utils.debug('GOT lessonId from headling "lesson X" match');
                    motch.lessonId = Number(headline.match(/(lesson|lecture) ([0-9])+/gi)[0].replace(/(lesson|lecture) /gi, ''));
                }
                // headline for lessonId/lessonName
                if (headline.match(/([0-9][0-9][0-9])./g)) {
                    if (!motch.lessonId) {
                        motch.lessonId = Number(headline.match(/([0-9][0-9][0-9])/g)[0]);
                    }
                    if (!motch.lessonName) {
                        utils.debug('GOT lessonName from headline for "lessonId/lessonName"');
                        motch.lessonName = utils.substrToEnd(headline, '.');
                    }
                }
                // if Flash Player is required on page
                if ($('h2:contains("Flash version")').length > 0) {
                    utils.debug('GOT needsFlash from page content');
                    motch.needsFlash = true;
                }
                // if found in breadcrumb
                var $backtoGrade = $('a.backto:contains("Grade")');
                var $gradeEl = $backtoGrade.length > 0 ? $backtoGrade : $('.breadcrumbpage a:contains("Grade")');
                if ($gradeEl.length > 0) {
                    var gradeElText = $gradeEl.text();
                    if (gradeElText.match(/[0-9]+/g)) {
                        utils.debug('GOT gradeNum from gradeElText');
                        motch.gradeNum = Number(gradeElText.match(/[0-9]+/g)[0]);
                    }

                    // Check if breadcrumb also has a class name
                    var getMinus = gradeElText.replace(/[0-9]+(st|th) grade /gi, '');
                    if (getMinus.length > 0 && !motch.className) {
                        utils.debug('GOT className from breadcrumb getMinus');
                        motch.className = getMinus.trim();
                    }
                }
                // overwrite if breadcrumb contains something like "Mathematics 8"
                var breadText = $('.breadcrumbpage a').text();
                if (breadText.match(/([A-Z])\w+ ([0-9])+/gi)) {
                    if (!motch.className) {
                        utils.debug('GOT className from something like "Math 8"');
                        if ((breadText.match(/ /g) || []).length > 1) {
                            motch.className = breadText;
                        } else {
                            motch.className = breadText.substr(0, breadText.indexOf(' ')).trim();
                        }
                        // STUPID EXCEPTIONS.
                        if (motch.className.indexOf('WL1') > -1) {
                            utils.debug('GOT className, gradeNum as exception for Gary WL1');
                            motch.className = motch.className.replace('WL1-Lesson', 'English - Western Literature');
                            motch.gradeNum = 10;
                        }
                    }
                    if (!motch.gradeNum) {
                        utils.debug('GOT gradeNum from breadcrumb like "Math 8"');
                        motch.gradeNum = Number(breadText.replace(motch.className + ' ', ''));
                    }
                }
                // if breadcrumb has a department link
                _.each($('a.backto'), (backtoo) => {
                    if($(backtoo).attr('href').match(/department/gi)) {
                        utils.debug('GOT departmentLink from breadcrumb');
                        motch.departmentLink = $(backtoo).attr('href').match(/ronpaulcurriculum/gi) ? $(backtoo).attr('href') : 'http://www.ronpaulcurriculum.com' + $(backtoo).attr('href');
                        if (!motch.className) {
                            utils.debug('GOT className from department breadcrumb');
                            motch.className = $(backtoo).text();
                        }
                    }
                });

                var exceptions = [
                    {
                        'className': 'English 2',
                        'classKeys': ['English 2'],
                        'authorName': 'Gary North',
                        'gradeNum': 10
                    },{
                       'className': 'English 1',
                        'classKeys': ['English I', 'English 1'],
                        'authorName': 'Gary North',
                        'gradeNum': 9
                    },{
                        'className': 'Government 1A',
                        'classKeys': ['GovA', 'Government 1A'],
                        'authorName': 'Gary North',
                        'gradeNum': 11
                    },{
                        'className': 'Economics',
                        'classKeys': ['Economics'],
                        'authorName': 'Gary North',
                        'gradeNum': 12
                    },{
                        'className': 'Business 1',
                        'classKeys': ['Business I', 'Business 1'],
                        'authorName': 'Gary North',
                        'gradeNum': 9
                    },{
                        'className': 'American History',
                        'classKeys': ['American History'],
                        'authorName': 'Gary North',
                        'gradeNum': 12
                    },{
                        'className': 'Business 2',
                        'classKeys': ['Business II', 'Business 2'],
                        'authorName': 'Richard Emmons',
                        'gradeNum': 10
                    },{
                        'className': 'Science',
                        'classKeys': ['Science'],
                        'authorName': 'Lindsey Schweitzer',
                        'gradeNum': 1
                    },{
                        'className': 'Physical Science',
                        'classKeys': ['Physical Science', 'Science 1'],
                        'authorName': 'John H. Hamilton',
                        'gradeNum': 9
                    },{
                        'className': 'Physics',
                        'classKeys': ['Physics'],
                        'authorName': 'John H. Hamilton',
                        'gradeNum': 12
                    },{
                        'className': 'Biology 1',
                        'classKeys': ['Biology'],
                        'authorName': 'Jacob Bear',
                        'gradeNum': 10
                    }
                ];
                _.each(exceptions, (exc) => {
                    if ((exc.authorName === 'Gary North' &&
                          (
                           $('.mgcontent:contains("lesson")').length > 0 ||
                           $('.mgcontent:contains("class")').length > 0 ||
                           $('.mgcontent:contains("assignment")').length > 0 ||
                           $('.mgcontent:contains("grade")').length > 0
                          )
                        ) ||

                        motch.authorName.indexOf(exc.authorName.substr(0, exc.authorName.indexOf(' '))) > -1) {
                          var exContinue = false;
                          _.each(exc.classKeys, (key) => {
                              if ($('.mgcontent:contains("' + key + '")').length > 0) {
                                  exContinue = true;
                              }
                          });
                          if (exContinue) {
                              utils.debug('GOT className, gradeNum from exception routine');
                              motch.className = exc.className;
                              motch.gradeNum = exc.gradeNum;
                          }
                    }
                });

                if (motch.lessonName == null) {
                    utils.debug('GOT lessonName from cleanup');
                    motch.lessonName = headline;
                }

                if (motch.authorName.toLowerCase() === 'tom woods') {
                    if (motch.className) {
                        switch(motch.className.toLowerCase()) {
                            case 'government':
                                motch.gradeNum = 11;
                                break;
                            case 'western':
                                motch.className = 'History';
                                motch.gradeNum = 11;
                        }
                    }
                }

                // ALL DONE.  If mostly null, set the title to the headline.
                if (!motch.lessonId && !motch.className && !motch.gradeNum) {
                    utils.debug('GOT lessonName from mostly null');
                    if (headline.match(/DIGITAL TOOLS/g)) {
                        utils.debug('GOT lessonId, className from mostly null');
                        motch.lessonId = Number(headline.match(/([0-9])+/g)[0]);
                        motch.className = 'Digital Tools';
                        motch.lessonName = utils.substrToEnd(headline, '.');
                    } else {
                        motch.lessonName = headline;
                    }
                }
                // BEGIN weird exceptions
                if (motch.className === 'STUDY') {
                    motch.gradeNum = null;
                }
                // END weird exceptions

                var overRider = function() {
                    utils.debug('GOT all via override');
                    motch.gradeNum = null;
                    motch.className = null;
                    motch.lessonId = null;
                    motch.lessonName = headline;
                    motch.authorName = $('.articlebyline').text();
                    tm.savePreferences(global.ids.prefsName, global.prefs);
                    if(Object.keys(motch).length) {
                        Object.keys(motch).forEach(key => {
                            $('#preview' + key).text(motch[key]);
                        });
                    }
                }

                if ($('.mgcontent a[href^="//www.ron"]').length > 4 ||
                   $('.mgcontent a[href^="https://www.ron"]').length > 4) {
                    overRider();
                }

                // GET EXTRA DETAILS
                var getExtraDetails = function (records) {
                    var assignText = '';
                    var extraLink;
                    var parHasAssign = $('.mgcontent').text().match(/(assignment)|(write [0-9]+ words)|(problem set)/gi);
                    if ($('.mgcontent p:contains("Problem Set")').length > 0 || motch.className === 'Mathematics') {
                        assignText = 'Math Problem Set';
                    }
                    if (($('.mgcontent p:contains("due")').length > 0 ||
                         $('.mgcontent p:contains("at the end of the week")').length > 0 ||
                         $('.mgcontent p:contains("ue tomorrow")').length > 0 ||
                         $('.mgcontent p:contains("urn in by")').length > 0) && $('.mgcontent p:contains("today")').length === 0 ||
                        ($('.mgcontent p:contains("eekly")').length > 0 && $('.mgcontent p:contains("ssignment")').length > 0 && motch.lessonId%5 !== 0) ) {
                        parHasAssign = false;
                    }
                    var parHasWorksheet = $('p:contains("worksheet")');
                    var parIsAnyPdfLinks = false;
                    $('p a').each((link) => {
                        if($('p a').eq(link).attr('href') && $('p a').eq(link).attr('href').indexOf('.pdf') > -1) {
                            parIsAnyPdfLinks = true;
                        }
                    })
                    if (parIsAnyPdfLinks && parHasWorksheet.length > 0) {
                        assignText = 'worksheet';
                    } else if (parHasAssign) {
                        var startRecording = false;
                        _.each($('.mgcontent').children(), (thisP, pIndex) => {
                            if ($(thisP).text().match(/assignment/gi)) {
                                startRecording = true;
                            }
                            if (startRecording) {
                                if (!$(thisP).hasClass('mgprintoptions')) {
                                    assignText += $(thisP).text() + '\n';
                                }
                            }
                        });
                        // assignText += $('.mgcontent blockquote').text();
                    }
                    // exception if we have a "reading assignment" only; can't turn in a reading assignment.
                    if ((assignText.match(/reading assignment/gi) || assignText.match(/reasing assignment/gi)) && (!assignText.match(/no reading assignment/gi) || !assignText.match(/no reasing assignment/gi)) && assignText.match(/assignment/gi).length === 1) {
                        assignText = null;
                        parHasAssign = false;
                    }
                    records.assignment = assignText;
                    if (parIsAnyPdfLinks && parHasWorksheet.length > 0) {
                        records.extraUrl = encodeURI(parHasWorksheet.find('a').attr('href'));
                    }
                    // if "lesson 123" appears twice, remove one of it and use some "assignment" text from body
                    if (records.title.indexOf('esson ') !== records.title.lastIndexOf('esson ')) {
                        var nixXtraWords = records.title.match(/lesson [0-9]+/i)[0];
                        records.title = records.title.substr(0, records.title.lastIndexOf(nixXtraWords));
                        if (parHasAssign && assignText.indexOf('ssignment:') > -1) {
                            var indOf = assignText.indexOf('ssignment:')+10;
                            records.title += assignText.substr(indOf, 50);
                        }
                    }
                    if (parIsAnyPdfLinks && parHasWorksheet.length > 0) { // alternatively we could/should use the title of the worksheet
                        var cleanPdfTitle = utils.substrToEnd(parHasWorksheet.find('a').attr('href'), '/');
                        console.log(cleanPdfTitle);
                        records.title = records.title.replace(':', ': ' + cleanPdfTitle);
                    }
                    if (records.title.match(/\.pdf/gi)) {
                        records.title = records.title.replace(/\.pdf/gi, '').replace(/8H[0-9]+/g, '');
                    }
                }

                // GET THE "COPYING" DETAILS
                var records = {
                    'extraUrl': null,
                    'url': document.URL,
                    'assignment': null,
                    'title': 'Lesson ' + motch.lessonId + ': ' + motch.lessonName
                }
                getExtraDetails(records);
                if (records.assignment && records.assignment.length > 0) {
                    records.title = records.title + ' [has assignment]';
                }

                // APPEND THE MISSING, MASSAGED ("COPYING") DETAILS BACK TO THE MOTCH
                motch = {
                    ...motch,
                    'lessonUrl': 'http://www.ronpaulcurriculum.com/members/' + motch.pageId + '.cfm',
                    'extraUrl': records.extraUrl,
                    'assignment': records.assignment
                };

                utils.debug('----------------------');
                for (const key in motch) {
                    utils.debug(`${key}: ${motch[key]}`);
                }

                var modalId = 'verifyMotches';
                var modalBody = '<button id="peekContinue" class="fingery btn btn-primary">Peek at page</button>';
                    modalBody += '<style>.popupDetailWindow { height:inherit; top:0px; }</style>';
                var addBody = function(label, content) {
                    if (content == null) {
                        content = label;
                        label = '&nbsp;';
                    }
                    modalBody += '    <div class="popupDetailTitle">' + label + '</div><div class="popupDetailContent" id="preview' + label + '">' + (content || 'null') + '</div>';
                };

                if(Object.keys(motch).length) {
                    Object.keys(motch).forEach(key => {
                        var motchToModal = 'null';
                        if (typeof motch[key] == 'boolean') {
                            motchToModal = motch[key].toString();
                        }
                        if (motch[key]) {
                            if (typeof motch[key] == 'string') {
                                if (motch[key].length < 200) {
                                    motchToModal = motch[key];
                                } else {
                                    motchToModal = '...!';
                                }
                            } else {
                                motchToModal = motch[key];
                            }
                        }
                        // && motch[key].length < 500 || (motch[key] && !motch[key].substr)) ? motch[key] : '[TOO MUCH TO DISPLAY]';
                        addBody(key, motchToModal);
                        if (!motch[key] && key === 'lessonName') {
                            addBody('<a href="javascript:void(0);" id="headlineToTitle' + key + '">[Add Headline]</a>');
                        }
                    });
                }
                var thirdSlotButton = '',
                    firstSlotButton = '';
                if (!global.prefs.copyOn) {
                    firstSlotButton = '<button id="confContinue" class="fingery btn btn-primary">Confirm and Continue</button>';
                    thirdSlotButton = '&nbsp;<button id="confStopCount" class="fingery btn btn-secondary"></button>';
                } else {
                    thirdSlotButton = '&nbsp;<button id="confManualCopy" class="fingery btn btn-primary">Copy for Classroom</button>' +
                        '&nbsp;<button id="confDeactivateCopy" class="fingery btn btn-secondary">Copy: ' + (global.prefs.copyOn ? 'On' : 'Off') + '</button>';
                }
                addBody('',
                        firstSlotButton +
                        '&nbsp;<button id="confOverride" class="fingery btn btn-secondary">Override</button>' +
                        thirdSlotButton);

                if (!document.getElementById(modalId)) {

                    tm.showModal(modalId, modalBody);

                    if (!global.prefs.copyOn) {
                        var autoCount = 5;
                        var countTimeout;
                        var countOne = function() {
                            $('#confStopCount').text('Cancel Auto ' + autoCount)
                            countTimeout = setTimeout(function() {
                                autoCount--;
                                if (autoCount > 0) {
                                    countOne();
                                } else {
                                    if (document.getElementById('RPCModsOptions') == null) {
                                        $('#confContinue').click();
                                    }
                                }
                            }, 1000);
                        }
                        countOne();
                        $('.popupDetailWindow .fingery').on('click', (e) => {
                            clearTimeout(countTimeout);
                            $('#confStopCount').remove();
                        });
                    }

                    if(Object.keys(motch).length) {
                        Object.keys(motch).forEach(key => {
                            $('#preview' + key).on('click', (e) => {
                                var result = prompt('New Value');
                                if (result !== '') {
                                    $('#preview' + key).text(result);
                                } else {
                                    $('#preview' + key).text('null');
                                    utils.flickerElement(document.getElementById('#preview' + key));
                                }
                                motch[key] = result === '' ? null : result;
                                for (const key in motch) {
                                    utils.debug(`${key}: ${motch[key]}`);
                                }
                            });
                            $('#headlineToTitle' + key).on('click', (e) => {
                                var newVal = utils.substrToEnd(headline, '.');
                                $('#preview' + key).text(newVal);
                                motch[key] = newVal;
                                $('#headlineToTitle' + key).parent().prev().remove();
                                $('#headlineToTitle' + key).parent().remove();
                            });
                        });
                    }

                }

                $('#confManualCopy').on('click', (e) => {
                    var iDelay = 0;
                    for (const key in records) {
                        if (records[key]) {
                            setTimeout(function() {
                                tm.copyTextToClipboard(records[key]);
                                utils.debug(`Copying ${key}\n\n${records[key]}\n\n`);
                            }, iDelay);
                            iDelay += 1000;
                        }
                    }
                    setTimeout(function() {
                        var audio = {
                            "misc": [
                                'WW_SmallPot_Drop1.wav',
                                'WW_PauseMenu_Save_Yes.wav',
                                'WW_LargePot_Drop1.wav',
                                'WW_LargeChest_Open1.wav',
                                'ZSS_LowHealth.wav',
                                'ZSS_StaminaGauge_Empty.wav'
                            ]
                        };
                        if (!document.getElementById(audio.misc[0].split('.')[0])) {
                            if (audio.misc != null && audio.misc.length > 0) {
                                _.each(audio.misc, function(snd) {
                                    utils.renderAudioElement(snd);
                                });
                            }
                        }
                        var soundName = audio.misc[Math.floor(Math.random() * audio.misc.length)],
                            soundElement;
                        if (soundName != null) {
                            soundElement = document.getElementById(soundName.split('.')[0]);
                            soundElement.play();
                        }
                    }, iDelay)
                });

                $('#confDeactivateCopy').on('click', (e) => {
                    global.prefs.copyOn = !global.prefs.copyOn
                    $('#confDeactivateCopy').text('Copy: ' + (global.prefs.copyOn ? 'On' : 'Off'));
                    tm.savePreferences(global.ids.prefsName, global.prefs);
                });

                $('#confContinue').on('click', (e) => { // THIS IS WHERE WE ADD TO OUR SCRAPES. HERE IS WHERE THE MAGIC HAPPENS.
                    if (!global.prefs.scrapes.find((x) => x.pageId === motch.pageId)){
                        global.prefs.scrapes.push(motch);
                        global.prefs.scrapeIndex++;
                        tm.savePreferences(global.ids.prefsName, global.prefs);
                        window.location.href = '/members/' + global.prefs.scrapeIndex + '.cfm';
                    } else {
                        tm.log('TRIED TO PUSH AN EXISTING MOTCH');
                    }
                });
                $('#confOverride').on('click', (e) => {
                    overRider();
                });
                $('#peekContinue').on('click', (e) => {
                    if ($('#' + modalId).css('opacity') !== '1') {
                        $('#' + modalId).css({'height':'inherit', 'opacity':'1' });
                    } else {
                        $('#' + modalId).css({'height':'10%', 'opacity':'0.3' });
                    }
                });

            }
        };

    (function() { // Global Functions
        document.onmousemove = function(){
            if (!global.states.isMouseMoved) {
                global.states.isMouseMoved = true;
                setTimeout(function() {
                    global.states.isMouseMoved = false;
                }, global.constants.TIMEOUT * 2);
                utils.initScript();
            }
        };
    })(); // Global Functions
    utils.initScript();
    setTimeout(function() {
        global.states.isMouseMoved = false;
    }, global.constants.TIMEOUT * 2);
})();

