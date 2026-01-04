// ==UserScript==
// @name         WaniKani App Store
// @version      1.3.0
// @description  Never miss an awesome WaniKani script again!
// @author       hitechbunny
// @include      https://www.wanikani.com/*
// @include      https://community.wanikani.com/*
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/149329
// @downloadURL https://update.greasyfork.org/scripts/35387/WaniKani%20App%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/35387/WaniKani%20App%20Store.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var api_key;
    var globalVariables = {};
    var scripts;
    var uuid;

    if (window.location.pathname.indexOf('/script/appStore') === 0) {
        renderAppStore();
    } else {
        setUuid();
        renderHooks();
        recordCss();
        loadGlobalVariablesThenTrackScripts();
    }

    function loadGlobalVariablesThenTrackScripts() {
        if (localStorage.appStoreGlobalVariables) {
            globalVariables = JSON.parse(localStorage.appStoreGlobalVariables);
            setTimeout(trackScripts, 100);
        } else {
            get_api_key().then(function() {
                ajax_retry('https://wanikanitools-golang.curiousattemptbunny.com/scripts?api_key='+api_key).then(function(json) {
                    storeGlobalVariables(json);
                    globalVariables = JSON.parse(localStorage.appStoreGlobalVariables);
                    setTimeout(trackScripts, 100);
                });
            });
        }
    }

    function renderHooks() {
        // Hook into App Store
        $('<li class="app-store-menu-item-actual"><a href="/script/appStore">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")'));

        var css =
            '.app-store-menu-item { display: none; }'+

            '';

        $('head').append('<style type="text/css">'+css+'</style>');
    }

    function setUuid() {
        function generateUuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }
        uuid = localStorage.appStoreUuid;
        if (!uuid) {
            uuid = generateUuid();
            localStorage.appStoreUuid = uuid;
        }
        console.log("AppStoreUUID: "+uuid);
    }

    function renderAppStore() {
        var jQuery = '<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>';
        var css = ''+
            'html#main .nav li.heading { width: initial; margin-top: 20px; }'+
            '.preview { margin-right: 10px; width: 100px; height: 80px; background-color: #ddd; background-repeat: no-repeat; background-size: 100%; border: 1px solid #ccc; min-width: 100px; min-height: 90px; background-position: center; }'+
            '.preview .missing { filter: blur(5px); background-color: #ddd; position: relative; }'+
            '.preview .missing span { font-size: 6em; position: absolute; top: 33px; left: 25px; color: #ccc;}'+
            '.scripts { display: flex; flex-wrap: wrap; max-height: 330px; overflow-y: hidden; border-top: 1px solid #ccc; padding-top: 1em; }'+
            '.scripts.more { max-height: initial; }'+
            '.script { margin-right: 20px; display: flex; flex-grow: 0; flex-shrink: 0; width: 270px; height: 110px; }'+
            '.script a { color: initial; }'+
            '.script .install { margin-top: 9px; }'+
            '.script .install div { background-color: #dde; border-radius: 9px; font-size: 0.8em; padding-left: 4px; padding-right: 4px; padding-top: 2px; padding-bottom: 2px; text-align: center; width: 6em; }'+
            '.detail { width: 170px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }'+
            '.detail a { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px; display: inline-block; }'+
            '.name { font-weight: bold; }'+
            '.author { } '+
            '.heart { color: indianred; }'+
            '.octicon { filter:opacity(50%); width: 100%; height: 100%; background-repeat: no-repeat; background-position: center; background-size: 35%; }'+
//            '.installed .octicon { background-image: url("https://wanikanitools-golang.curiousattemptbunny.com/static/octicons/bookmark.svg"); }'+
            '.installed .octicon { background-image: url("https://wanikanitools-golang.curiousattemptbunny.com/static/octicons/repo.svg"); }'+
            '.new .octicon { background-size: 40%; background-image: url("https://wanikanitools-golang.curiousattemptbunny.com/static/octicons/radio-tower.svg"); }'+
            '.top-charts .octicon { background-image: url("https://wanikanitools-golang.curiousattemptbunny.com/static/octicons/flame.svg"); }'+
            '.categories .octicon { background-size: 45%; background-image: url("https://wanikanitools-golang.curiousattemptbunny.com/static/octicons/book.svg"); }'+
            '.search .octicon { background-image: url("https://wanikanitools-golang.curiousattemptbunny.com/static/octicons/search.svg"); }'+
            '#search { display: none; }'+
            '.active_users.undetected { color:#ccc; }'+
            '#avatar { '+(localStorage.avatarStyle ? localStorage.avatarStyle : 'background-image: url("//www.gravatar.com/avatar/734f8eaa3fb9b256f2678ddb2ef89ea5.jpg?s=200&timestamp=11202017&d=https://cdn.wanikani.com/default-avatar-300x300-20121121.png"); display: block;')+' }'+
            'h3 { margin-bottom: 0.4em; margin-top: 2.5em; }'+
//            '.installs { float: right; }'+
            '';

        var html = '<html id="main"><head>'+localStorage.wanikanicss+jQuery+'<script src="https://unpkg.com/js-search@1.3.7/dist/umd/js-search.min.js"></script>'+'<style type="text/css">'+css+'</style>'+
            '<script>'+
            '    var api_key;'+
'    var globalVariables = {};'+
'    var scripts;'+
            ' var uuid;'+
                              renderPage.toString()+"\n"+
                              init.toString()+"\n"+
                              get_api_key.toString()+"\n"+
                              ajax_retry.toString()+"\n"+
                              storeGlobalVariables.toString()+"\n"+
            setUuid.toString()+"\n"+
                              "init();\n"+
            '</script>'+
                              '</head><body>Loading ...</body></html>';
        window.document.write(html);

        function renderPage() {
            var html = ''+
                '<div class="navbar navbar-static-top">'+
                '  <div class="navbar-inner">'+
                '    <div class="container">'+
                '      <ul class="nav">'+
                '        <li class="title">'+
                '          <a href="/dashboard">'+
                '            <span></span><span lang="ja">鰐蟹</span>'+
                '          </a>'+
                '        </li>'+
                '        <li class="heading">'+
                '          <h1>App Store</h1>'+
                '        </li>'+
                '        <li class="new">'+
                '          <a href="/script/appStore/new"><span><div class="octicon"></div></span><span>New</span></a>'+
                '        </li>'+
                '        <li class="top-charts">'+
                '          <a href="/script/appStore/top"><span><div class="octicon"></div></span><span>Top Charts</span></a>'+
                '        </li>'+
                '        <li class="categories">'+
                '          <a href="/script/appStore/categories"><span><div class="octicon"></div></span><span>Categories</span></a>'+
                '        </li>'+
                '        <li class="installed">'+
                '          <a href="/script/appStore/installed"><span><div class="octicon"></div></span><span>Installs</span></a>'+
                '        </li>'+
                '        <li class="search">'+
                '          <a href="/script/appStore/search"><span><div class="octicon"></div></span><span>Search</span></a>'+
                '        </li>'+
                '      </ul>'+
                '<ul class="nav pull-right">'+
                '  <li class="dropdown account" data-dropdown="">'+
                '    <a href="#" class="dropdown-toggle" data-toggle="dropdown">'+
                '      <span id="avatar">&nbsp;</span>Menu'+
                '      <i class="icon-chevron-down"></i>'+
                '    </a>'+
                '    <ul class="dropdown-menu">'+
                '      <li class="nav-header">'+
                '        Home'+
                '      </li><li>'+
                '        <a href="/dashboard">Dashboard</a>'+
                '      </li><li>'+
                '        <a href="https://community.wanikani.com">Community</a>'+
                '      <li class="app-store-menu-item-actual"><a href="/script/appStore">App Store</a></li><li class="nav-header">'+
                '        Account'+
                '      </li><li>'+
                '        <a href="/users/hitechbunny">Profile</a>'+
                '      </li><li>'+
                '        <a href="/settings/app">Settings</a>'+
                '      </li><li>'+
                '        <a href="/account/subscription">Subscription</a>'+
                '      </li><li>'+
                '        <a rel="nofollow" data-method="delete" href="/logout">Sign Out</a>'+
                '      </li>'+
                '    </ul>'+
                '  </li><li class="top" style="display: none;">'+
                '    <a><i class="icon-circle-arrow-up"></i></a>'+
                '  </li>'+
                '</ul>'+
                '    </div>'+
                '  </div>'+
                '</div>'+
                '<div id="search">'+
                '  <div class="container">'+
                '    <div class="row">'+
                '      <div class="span3"></div>'+
                '      <div class="span6">'+
                '        <form id="search-form" accept-charset="UTF-8" style="width:100%; margin-top:50px;">'+
                '          <span id="main-ico-search"><i class="icon-search"></i></span>'+
                '          <input type="text" name="query" id="query" class="search-query" style="width:100%; height:2em;">'+
                '        </form>'+
                '      </div>'+
                '      <div class="span3"></div>'+
                '    </div>'+
                '  </div>'+
                '</div>'+
                '<div style="margin-bottom: 100px;">'+
                '  <div class="container listings"></div>'+
                '</div>'+
                '<footer>'+
                '  <div class="container">'+
                '    <div class="row">'+
                '      <div class="span12">'+
                '        <ul>'+
                '          <li>'+
                '            <a href="/about">About</a>'+
                '          </li><li>'+
                '            <a href="https://wanikani.tumblr.com/">Blog</a>'+
                '          </li><li>'+
                '            <a href="/api">API</a>'+
                '          </li><li>'+
                '            <a href="/faq">FAQ</a>'+
                '          </li><li>'+
                '            <a target="_blank" href="/terms">Terms</a>'+
                '          </li><li>'+
                '            <a target="_blank" href="/privacy">Privacy</a>'+
                '          </li><li>'+
                '            <a href="/contact">Contact</a>'+
                '          </li><li>'+
                '            Copyright © Tofugu LLC, <span lang="ja">よ</span>'+
                '          </li>'+
                '        </ul>'+
                '      </div>'+
                '    </div>'+
                '  </div>'+
                '</footer>';

            $('body').html(html);
            $('.dropdown.account').click(function() { $('.dropdown.account').toggleClass('open'); });

            get_api_key().then(function() {
                ajax_retry('https://wanikanitools-golang.curiousattemptbunny.com/scripts?api_key='+api_key).then(function(json) {
                    storeGlobalVariables(json);
                    var appStoreInstalledScripts = JSON.parse(localStorage.appStoreInstalledScripts || '{}');
                    var installedOnOtherBrowsers = {};
                    Object.keys(json.browser_installs).forEach(function(browserUuid) {
                        if (browserUuid == uuid) {
                            return;
                        }

                        json.browser_installs[browserUuid].forEach(function(script) {
                            installedOnOtherBrowsers[script.name] = script;
                        });
                    });
                    (json.browser_installs[uuid] || []).forEach(function(script) {
                        delete installedOnOtherBrowsers[script.name];
                    });

                    var alreadyRendered = {};

                    var sections = [];
                    var page = window.location.pathname.split('/');
                    page = page[page.length-1];

                    var generalRanking = function(s) { return s.likes + (s.img_url ? 300 : 0) + (s.percentage_of_users > 0 ? 100*s.percentage_of_users : 0); };
                    if (page == 'top') {
                        sections.push(["Top Active Users", function(s) { return s.percentage_of_users; }, null, '']);
                        sections.push(["Top Likes", function(s) { return s.likes; }, null, '']);
                    } else if (page == 'search') {
                        var search = new JsSearch.Search('name');
                        search.addIndex('name');
                        search.addIndex('description');
                        search.addIndex('author');
                        search.addIndex('categories');
                        search.addDocuments(json.available_scripts);
                        $('#query').keyup(function(e) {
                            var query = $('#query').val();
                            if (query.length === 0) {
                                $('.scripts .script').show();
                            } else {
                                $('.scripts .script').hide();
                                var selector = search.search(query).map(function(s) { return "#script-"+s.topic_id; }).join(",");
                                $(selector).show();
                            }
                        });

                        sections.push(["Search Results", generalRanking, null, 'more']);
                        $('#search').show();
                    } else if (page == 'installed') {
                        sections.push(['Installed', function(s) { return s.topic_id; }, appStoreInstalledScripts, 'more']);
                        sections.push(['Installed On Your Other Browser(s)', function(s) { return s.topic_id; } , installedOnOtherBrowsers, 'more']);
                    } else if (page == 'categories') {
                        var maps = {
                            'level-overview': {},
                            'lessons': {},
                            'reviews': {},
                            'dashboard': {},
                            'community': {},
                            'other': {}
                        };
                        json.available_scripts.forEach(function(script) {
                            console.log(script);
                            if (script.categories.length === 0) {
                                maps.other[script.name] = script;
                            } else {
                                script.categories.forEach(function(category) {
                                    maps[category] = maps[category] || {};
                                    maps[category][script.name] = script;
                                });
                            }
                        });
                        sections.push(['Dashboard', generalRanking, maps.dashboard, '']);
                        sections.push(['Reviews', generalRanking, maps.reviews, '']);
                        sections.push(['Lessons', generalRanking, maps.lessons, '']);
                        sections.push(['Levels Overviews', generalRanking, maps['level-overview'], '']);
                        sections.push(['Forum', generalRanking, maps.community, '']);
                        sections.push(['Other', generalRanking, maps.other, '']);
                    //} else if (page == 'new') {
                    } else {
                        sections.push(["New Releases", function(s) { return s.topic_id; }, null, '']);
                    }

                    sections.forEach(function(category) {
                        var categoryFilter = category[2];
                        var html = '<h3>'+category[0]+'</h3><div class="scripts '+category[3]+'">';

                        json.available_scripts.sort(function(a,b) { return category[1](b) - category[1](a); });
                        var i = 0;
                        var number = 0;
                        var renderCount = 0;
                        var renderMax = category[3] !== '' ? 1000 : 12;
                        while(renderCount < renderMax && i < json.available_scripts.length) {
                            var s = json.available_scripts[i];
                            i += 1;
                            if (categoryFilter && !categoryFilter[s.name]) {
                                continue;
                            }
                            number += 1;
                            renderCount += 1;
                            alreadyRendered[s.topic_id] = true;
                            html +=
                                '<div class="script" title="'+s.name.replace('"', '')+'" id="script-'+(s.topic_id)+'">';
                            html += '<a href="'+s.topic_url+'">';
                            if (s.img_url) {
                                html +=
                                    '   <div class="preview" style="background-image: url('+s.img_url+'");"/>';
                            } else {
                                html +=
                                    '   <div class="preview"><div class="missing"><span>?</span></div></div>';
                            }
                            html += '</a>';

                            html +=
                                '   <div class="detail">'+
                                '     <a href="'+s.topic_url+'">'+
                                '     <span class="name">'+(category[0] == "All..." || category[0] == 'Installed' || category[0] == 'Installed On Your Other Browser(s)' ? '' : (number+'. '))+s.name.replace('WaniKani:', '').replace('WaniKani', '').replace('WK', '').replace('Wanikani', '')+'</span><br>'+
                                '     <span class="likes">'+s.likes+'</span>&nbsp;<span class="heart">❤</span><br>';

                            if (s.percentage_of_users === 0) {
                                html += '<span class="active_users undetected">no app store hook</span><br>';
                            } else {
                                html += '     <span class="active_users">'+Math.round(s.percentage_of_users)+'% of users</span>';
                            }
                            html += '</a><br>';

                            if (s.percentage_of_users !== 0) {
                                if (appStoreInstalledScripts[s.name]) {
                                    html += '<a href="'+s.script_url+'" class="install installed"><div>INSTALLED</div></a>';
                                } else {
                                    html += '<a href="'+s.script_url+'" class="install uninstalled"><div>GET</div></a>';
                                }
                            } else {
                                html += '<a href="'+s.topic_url+'" class="install fourm"><div>FORUM</div></a>';
                            }

                            //html += '     <span class="author">'+s.author+'</span><br>';
                            html += '   </div>'+
                                '';

                            html +=
                                '</div>';

                            console.log(html);
                        }

                        html += '</div>';
                        if (html.indexOf("preview") != -1) {
                            $('.listings').append(html);
                        }
                    });
                });
            });
        }

        function init() {
          console.log("init started");
          setUuid();
          function waitForJquery() {
              if (typeof($) == 'function') {
                  renderPage();
              } else {
                  console.log('Waiting for jquery...');
                  setTimeout(waitForJquery, 100);
              }
          }

          console.log("Wait for jquery:");
          setTimeout(waitForJquery, 0);
        }
    }

    var nextTrackScripts = 200;
    function trackScripts() {
        var installedNewScript = false;
        var lastSeen = parseInt(localStorage.appStoreInstalledScriptsLastTransmission || 0+"");
        var appStoreInstalledScripts = JSON.parse(localStorage.appStoreInstalledScripts || '{}');
//        console.log("Installed:");
        Object.getOwnPropertyNames(window.appStoreRegistry || {}).forEach(function(appKey) {
//            console.log("\t"+appKey);
            var gminfo = window.appStoreRegistry[appKey];
            var fingerprint = {};
            fingerprint.version = gminfo.script.version;
            fingerprint.author = gminfo.script.author;
            fingerprint.description = gminfo.script.description;
            fingerprint.includes = gminfo.script.includes;
            fingerprint.name = gminfo.script.name;
            fingerprint.uuid = gminfo.script.uuid;
            fingerprint.lastSeenInstalled = Date.now();

            var key = fingerprint.name; //fingerprint.updateUrl ? fingerprint.updateUrl : fingerprint.author+"|"+fingerprint.name;
//            console.log(fingerprint);
//            console.log(gminfo);

            if (!appStoreInstalledScripts[key]) {
                console.log("Installed! "+key);
                installedNewScript = true;
            }
            appStoreInstalledScripts[key] = fingerprint;
        });

        function addScriptsByGlobalVariables(vars) {
            console.log("Found global variable: "+vars+"!");

            vars.forEach(function(v) {
                var name = globalVariables[v];
                globalVariables[v] = false; // avoid repeated detection
                if (!appStoreInstalledScripts[name]) {
                    scripts.forEach(function(script) {
                        if (script.name == name) {
                            console.log("Installed! "+name);
                            var fingerprint = {};
                            fingerprint.name = name;
                            fingerprint.lastSeenInstalled = Date.now();
                            appStoreInstalledScripts[name] = fingerprint;
                        }
                    });
                }
            });
        }

        var foundVariables = Object.keys(window).filter(function(key) {
            return globalVariables[key] && !appStoreInstalledScripts[globalVariables[key]];
        });

        if (foundVariables.length > 0) {
            console.log(foundVariables);

            if (scripts) {
                addScriptsByGlobalVariables(foundVariables);
                remainder();
            } else {
                get_api_key().then(function() {
                    ajax_retry('https://wanikanitools-golang.curiousattemptbunny.com/scripts?api_key='+api_key).then(function(json) {
                        scripts = json.available_scripts;
                        addScriptsByGlobalVariables(foundVariables);
                        remainder();
                    });
                });
            }
        } else {
            remainder();
        }

        function remainder() {
            localStorage.appStoreInstalledScripts = JSON.stringify(appStoreInstalledScripts);
            if (nextTrackScripts < 60000) {
                setTimeout(trackScripts, nextTrackScripts);
            }
            nextTrackScripts *= 4;

            if (installedNewScript || Date.now() - lastSeen > 1000 * 60 * 60 * 12) {
                get_api_key().then(function() {
                    ajax_retry("https://wanikanitools-golang.curiousattemptbunny.com/scripts/installed?api_key="+api_key+"&browser_uuid="+uuid, {retries: 1, method: 'POST', data: JSON.stringify({installed: appStoreInstalledScripts})}).then(function() {
                        localStorage.appStoreInstalledScriptsLastTransmission = Date.now()+"";
                    }, function(error) {
                        console.log("App Store failed to transmit installed scripts.");
                    });
                });
            }
        }
    }

    function recordCss() {
        var elements = $('head link[rel="stylesheet"]');
        var css = '';
        for(var i=0; i<elements.length; i++) {
            css += elements[i].outerHTML;
        }
        localStorage.wanikanicss = css;

        var avatarStyle = $('.dropdown.account a span').attr('style');
        if (avatarStyle) {
            localStorage.avatarStyle = avatarStyle;
        }
    }

    function storeGlobalVariables(json) {
        scripts = json.available_scripts;
        var globalVariables = {};
        json.available_scripts.forEach(function(script) {
            script.global_variables.forEach(function(k) {
                globalVariables[k] = script.name;
            });
        });
        localStorage.appStoreGlobalVariables = JSON.stringify(globalVariables);
    }

    //-------------------------------------------------------------------
    // Fetch a document from the server.
    //-------------------------------------------------------------------
    function ajax_retry(url, options) {
        //console.log(url, retries, timeout);
        options = options || {};
        var retries = options.retries || 3;
        var timeout = options.timeout || 3000;
        var headers = options.headers || {};
        var method = options.method || 'GET';
        var data = options.data || undefined;
        var cache = options.cache || false;

        function action(resolve, reject) {
            $.ajax({
                url: url,
                method: method,
                timeout: timeout,
                headers: headers,
                data: data,
                cache: cache
            })
            .done(function(data, status){
                //console.log(status, data);
                if (status === 'success') {
                    resolve(data);
                } else {
                    //console.log("done (reject)", status, data);
                    reject();
                }
            })
            .fail(function(xhr, status, error){
                //console.log(status, error);
                if ((status === 'error' || status === 'timeout') && --retries > 0) {
                    //console.log("fail", status, error);
                    action(resolve, reject);
                } else {
                    reject();
                }
            });
        }
        return new Promise(action);
    }

    function get_api_key() {
        return new Promise(function(resolve, reject) {
            api_key = localStorage.getItem('apiKey_v2');
            if (typeof api_key === 'string' && api_key.length == 36) return resolve();

            // status_div.html('Fetching API key...');
            ajax_retry('/settings/account').then(function(page) {

                // --[ SUCCESS ]----------------------
                // Make sure what we got is a web page.
                if (typeof page !== 'string') {return reject();}

                // Extract the user name.
                page = $(page);

                // Extract the API key.
                api_key = page.find('#user_api_key_v2').attr('value');
                if (typeof api_key !== 'string' || api_key.length !== 36) {
                    return reject(new Error('generate_apikey'));
                }

                localStorage.setItem('apiKey_v2', api_key);
                resolve();

            },function(result) {
                // --[ FAIL ]-------------------------
                reject(new Error('Failed to fetch API key!'));

            });
        });
    }
})();