// ==UserScript==
// @name         IGDB List Extra Info
// @namespace    https://greasyfork.org/de/users/155913-nkay08
// @description  Adds additional information  (genre, rating, keywords)to igdb.com lists. They can be loaded witha button // click. Needs an IGDB api key.
//
// @author       NKay
// @include        http*://www.igdb.com/*
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version 0.0.3.201808121415
// @downloadURL https://update.greasyfork.org/scripts/35311/IGDB%20List%20Extra%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/35311/IGDB%20List%20Extra%20Info.meta.js
// ==/UserScript==


//insert your API-KEY here
var apikey = '';


var apiurl;
var req;
var reqid;
var corsproxy;
var fields;
var fieldsall


var myheaders;

var gametextarray;
var gameidarray;
var genresnodearray;
var keywordsnodearray;
var ratingnodearray;
var ttbnodearray;

var keyword_dict = {};
var genres_dict = {};
var id_list = {};
var genres_list_list = {};
var genres_list = {};
var keyword_list = {};
var games_info = {};
var games_text_info = {};

var idortext;

var keyelement = "div.content-left.col-md-pull-10.col-md-2";
//only execute function if this element is loaded via ajax
waitForKeyElements(keyelement, checkForElement);

//waitForKeyElements(keyelement,alert1);

function alert1() {
    alert('alert');
}

function init() {
    apiurl = 'https://api-endpoint.igdb.com';
    req = '/games/?search=';
    reqid = '/games/1942?fields=*';
    corsproxy = 'https://cors-anywhere.herokuapp.com/';
    fields = '?fields=genres,keywords,rating,rating_count,aggregated_rating,aggregated_rating_count,total_rating,total_rating_count,time_to_beat';
    fieldsall = 'fields=*';
    myheaders = new Headers();
    myheaders.append('user-key', apikey);
    myheaders.append('Accept', 'application/json');
    gametextarray = [];
    gameidarray = [];
    genresnodearray = [];
    keywordsnodearray = [];
    ratingnodearray = [];
    ttbnodearray = [];

    reset_data();

    idortext = 'text';

    /*var fe = fetch('https://cors-anywhere.herokuapp.com/https://api-endpoint.igdb.com/games/?search=Halo&fields=*', {headers: myheaders})
    .then(res2 => res2.json())
    .then(data => console.log("halo",data))
    .catch(function (err) {
        console.log(err.message);
        console.log(err.stack);
    })
    .catch(function (err) {
        console.log(err.message);
        console.log(err.stack);
    });*/


}

function checkForElement(jnode) {
    if (!document.getElementById('btnaddinfo')) {
        init();
        addButton();
        addAdditionalInfo();
    }
}

function populateGametextarray(element) {
    //get the game name
    //console.log(element);
    var gameurlelement = element.getElementsByTagName('a');
    var gameurl = gameurlelement[0].getAttribute("href");
    var found = gameurl.match(/[A-Za-z0-9_\-]*$/);
    var textfromurl = found[0].replace(/-/g, " ");
    var span1 = element.getElementsByTagName('span');
    var gametext = span1[0].innerHTML;
    var cururl = corsproxy + apiurl + req + gametext;
    gametextarray.push(gametext);
    //console.log(textfromurl);
    //gametextarray.push(cururl);
    //console.log(cururl)

}

function populateGameidarray(element) {
    // get sibling. sibling has game id
    var sib = element.nextSibling;
    var gameid = sib.getAttribute("data-game");
}

function addTextNodes(div) {
    for (var i = 0; i < div.length; i++) {
        //     console.log(div[i]);
        addTextNode(div[i], i);
    }
}

function addTextNode(el, i) {
    var genrestext = document.createTextNode('Genres: ');
    var genresspan = document.createElement('span');
    genresspan.style.fontSize = 'medium';
    genresspan.style.textDecoration = 'underline';
    genresspan.appendChild(genrestext);
    el.appendChild(genresspan);
    var genresnode = document.createElement('span');
    genresnode.setAttribute("id", "usgenre" + i.toString());
    el.appendChild(genresnode);
    genresnodearray.push(genresnode);
    el.appendChild(document.createTextNode('   |   '));
    var keywordstext = document.createTextNode('Keywords: ');
    var kwspan = document.createElement('span');
    kwspan.style.fontSize = 'medium';
    kwspan.style.textDecoration = "underline";
    kwspan.appendChild(keywordstext);
    el.appendChild(kwspan);
    var keywordsnode = document.createElement('span');
    keywordsnode.setAttribute("id", "uskw" + i.toString());
    el.appendChild(keywordsnode);
    keywordsnodearray.push(keywordsnode);
    el.appendChild(document.createTextNode('   |   '));
    var ratingtext = document.createTextNode('Rating: ');
    var rtspan = document.createElement('span');
    rtspan.style.fontSize = 'medium';
    rtspan.style.textDecoration = "underline";
    rtspan.appendChild(ratingtext);
    el.appendChild(rtspan);
    var ratingnode = document.createTextNode('');
    el.appendChild(ratingnode);
    ratingnodearray.push(ratingnode);
    el.appendChild(document.createTextNode('   |   '));
    var ttbtext = document.createTextNode('TTB: ');
    var ttbspan = document.createElement('span');
    ttbspan.style.fontSize = 'medium';
    ttbspan.style.textDecoration = 'underline';
    ttbspan.appendChild(ttbtext);
    var ttbnode = document.createElement('span');
    el.appendChild(ttbspan);
    el.appendChild(ttbnode);
    ttbnodearray.push(ttbnode);

    if (idortext == 'text') {
        populateGametextarray(el);
    }
    if (idortext == 'id') {
        populateGameidarray(el);
    }


}


function addButton() {
    //add Button
    var btn = document.createElement("button");
    var btntext = document.createTextNode('Load info (less hits)');
    btn.appendChild(btntext);
    btn.addEventListener("click", function () {
        load(idortext);
    }, false);
    btn.setAttribute("id", "btnaddinfo");
    var btn2 = document.createElement("button");
    var btntext2 = document.createTextNode('Load genres (more hits)');
    btn2.appendChild(btntext2);
    btn2.addEventListener("click", function () {
        loadgenres(idortext);
    }, false);
    btn2.setAttribute("id", "btnaddinfo2");
    var btn3 = document.createElement("button");
    var btntext3 = document.createTextNode('Load keywords (more hits)');
    btn3.appendChild(btntext3);
    btn3.addEventListener("click", function () {
        loadkws(idortext);
    }, false);
    btn3.setAttribute("id", "btnaddinfo3");
    var sidebar = document.getElementsByClassName("user-details-sidebar");
    if (sidebar) {
        var sibling = sidebar[0].nextSibling;

        sibling.parentNode.insertBefore(btn, sibling);
        sibling.parentNode.insertBefore(btn2, sibling);
        sibling.parentNode.insertBefore(btn3, sibling);
        sibling.parentNode.insertBefore(document.createElement("hr"), sibling);
    }

    function load(str) {
        loadbytext4(gametextarray, 1, 1, 0, 0, 0);
    }

    function loadgenres(str) {
        loadbytext4(gametextarray, 0, 0, 1, 0, 0);
    }

    function loadkws(str) {
        loadbytext4(gametextarray, 0, 0, 0, 1, 0);
    }

    //    var firstbtn = document.getElementsByClassName("panel-title");
    //    firstbtn[0].parentNode.insertBefore(document.createElement('hr'), firstbtn[0]);
    //    firstbtn[0].parentNode.insertBefore(btn, firstbtn[0]);
    //   firstbtn[0].parentNode.insertBefore(document.createElement('hr'), firstbtn[0]);
}

function addAdditionalInfo(jnode) {
    console.log('Adding button and placeholders for extra info');
    //	var pageDivs = document.getElementsByClassName("media-body");
    //	addTextNodes(pageDivs);

    var selector = "#content-page > div > div.content-left.col-md-push-2.col-md-10 > div:nth-child(2) > div.panel-body.listentries > div > div:nth-child(n) > div.media-body";
    var selector2 = "#content-page > div > div.content-left.col-md-push-2.col-md-10 > div > div.panel-body.listentries > div > div:nth-child(5) > div";
    var selectorgen = "div.listentries div.media div.media-body";
    var queryres = document.querySelectorAll(selectorgen);
    addTextNodes(queryres);
    // console.log(queryres);

}

function removeChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

async function loadbytext4(textarray, r = 0, ttb = 0, g = 0, k = 0, reset = 0) {
    console.log("Try loading data");
    if (reset != 0) {
        reset_data();
    } else {

        if (r != 0) {
            ratingnodearray.forEach(element => element.nodeValue = 'loading..');
        }
        if (g != 0) {
            genresnodearray.forEach(element => element.innerHTML = 'loading..');
        }
        if (k != 0) {
            keywordsnodearray.forEach(element => element.innerHTML = 'loading..');
        }
        if (ttb != 0) {
            //console.log(ttbnodearray);
            ttbnodearray.forEach(element => element.innerHTML = 'loading..');
        }
        if (r != 0 || g != 0 || k != 0) {
            console.log("games_text_info", Object.keys(games_text_info).length, ", gametextarray", gametextarray.length);
            if (Object.keys(games_text_info).length == gametextarray.length) {
                console.log("processing data cached");
                if (r != 0) {
                    gather_ratings();
                }
                if (g != 0) {
                    gather_genres();
                }
                if (k != 0) {
                    gather_kws();
                }
                if (ttb != 0) {
                    gather_ttb();
                }
            } else {
                reset_data();
                var gamespromise = gather_games_text_info(textarray);
                gamespromise
                    .then(function (result) {
                        console.log("processing data");
                        //console.log("gg",games_text_info);
                        if (r != 0) {
                            gather_ratings();
                        }
                        if (g != 0) {
                            gather_genres();
                        }
                        if (k != 0) {
                            gather_kws();
                        }
                        if (ttb != 0) {
                            gather_ttb();
                        }
                    })
                    .then(function () {
                        //console.log("2. ", "id_list", Object.keys(id_list).length, ", games_info", Object.keys(games_info).length, ", gametextarray", gametextarray.length);
                    })
                    .catch(function (err) {
                        console.log(err.message);
                        console.log(err.stack);
                    });
            }


        }

    }


}

function reset_data() {

    keyword_dict = {};
    genres_dict = {};
    id_list = {};
    genres_list_list = {};
    genres_list = {};
    keyword_list = {};
    games_info = {};
    games_text_info = {};

}

function gather_ttb() {
    console.log("gather ttb");
    ttbnodearray.forEach(function (element, index) {
        //var curr_id = id_list[gametextarray[index]];
        var curr_text = gametextarray[index];
        //console.log(curr_id);
        var game_info = games_text_info[curr_text];
        //console.log(game_info);
        removeChildren(element);
        if (game_info.time_to_beat) {
            var ttb = game_info.time_to_beat;
            var ttbstr = "";
            if (ttb.hastly) {
                ttbstr += +(ttb.hastly / 3600).toFixed(2) + "(h), ";
            }
            if (ttb.normally) {
                ttbstr += +(ttb.normally / 3600).toFixed(2) + "(n), ";
            }
            if (ttb.completely) {
                ttbstr += (ttb.completely / 3600).toFixed(2) + "(c)";
            }

            element.appendChild(document.createTextNode(ttbstr));
            //console.log("ttb", game_info.time_to_beat);
        } else {
            element.appendChild(document.createTextNode('n/a'));
        }
    });
}

function gather_ratings() {
    console.log("gather ratings");
    ratingnodearray.forEach(function (element, index) {
        //console.log("ratingelement",element, index);
        //var curr_id = id_list[gametextarray[index]];
        //var game_info = games_info[curr_id];

        var curr_text = gametextarray[index];
        var game_info = games_text_info[curr_text];
        //console.log("curr", curr_id, game_info);

        removeChildren(element);
        var ratingstr = '';
        ratingstr = ratingstr.concat('User: ');
        if (game_info.rating) {
            ratingstr = ratingstr.concat(Math.round(game_info.rating).toString());
            ratingstr = ratingstr.concat(' (' + game_info.rating_count.toString() + ')');
        } else {
            ratingstr = ratingstr.concat('/');
        }
        ratingstr = ratingstr.concat(', ');
        ratingstr = ratingstr.concat('Critics: ');
        if (game_info.aggregated_rating) {
            ratingstr = ratingstr.concat(Math.round(game_info.aggregated_rating).toString());
            ratingstr = ratingstr.concat(' (' + game_info.aggregated_rating_count.toString() + ')');
        } else {
            ratingstr = ratingstr.concat('/');
        }
        ratingstr = ratingstr.concat(', ');
        ratingstr = ratingstr.concat('Total: ');
        if (game_info.total_rating) {
            ratingstr = ratingstr.concat(Math.round(game_info.total_rating).toString());
            ratingstr = ratingstr.concat(' (' + game_info.total_rating_count.toString() + ')');
        } else {
            ratingstr = ratingstr.concat('/');
        }
        element.nodeValue = ratingstr;
    });
}

async function gather_genres() {
    var genresurl = corsproxy + apiurl + '/genres/' + Object.keys(genres_list).toString();
    //console.log("genres list", genres_list);
    console.log("genres url", genresurl);
    fetch(genresurl, {headers: myheaders})
        .then(res => res.json())
        .then(function (data) {
            //console.log("gg", genrenodesarray);
            console.log('genres', data);
            //console.log("games_info",games_info);
            //console.log("id_list",id_list);
            genresnodearray.forEach(function (element, index) {
                removeChildren(element);
                //console.log("index", index);
                //var curr_id = id_list[gametextarray[index]];
                var curr_text = gametextarray[index];
                //console.log("curr_id", curr_id);
                var game_info = games_text_info[curr_text];
                console.log("info",game_info);
                if(game_info.genres){
                  var curr_genre_ids = game_info.genres;
                  for (let genre_id of curr_genre_ids) {
                      //console.log("genre_id",genre_id);
                      var curr_genre = data.find(item => item.id == genre_id);
                      //console.log("curr_genre", curr_genre);
                      var newgenre = document.createElement('a');
                      newgenre.setAttribute("href", curr_genre.url);
                      newgenre.appendChild(document.createTextNode(curr_genre.name + ', '));
                      element.appendChild(newgenre);
                }
                }
                else {
                  element.appendChild(document.createTextNode("n/a"));
                }
                

            });
        })
        .catch(function (err) {
            console.log(err.message);
            console.log(err.stack);
        });
}

async function gather_kws() {
    var kwurl = corsproxy + apiurl + '/genres/' + Object.keys(genres_list).toString();
    //console.log("genres list", genres_list);
    console.log("kw", kwurl);
    fetch(kwurl, {headers: myheaders})
        .then(res => res.json())
        .then(function (data) {
            //console.log("gg", genrenodesarray);
            console.log('kws', data);
            //console.log("games_info",games_info);
            //console.log("id_list",id_list);
            keywordsnodearray.forEach(function (element, index) {
                removeChildren(element);
                //console.log("index", index);
                //var curr_id = id_list[gametextarray[index]];
                var curr_text = gametextarray[index];
                //console.log("curr_id", curr_id);
                var game_info = games_text_info[curr_text];
                if(game_info.keywords){
                  var curr_kw_ids = game_info.keywords;
                  for (let kw_id of curr_kw_ids) {
                    //console.log("genre_id",genre_id);
                    var curr_kw = data.find(item => item.id == kw_id);
                    //console.log("curr_genre", curr_genre);
                    var newkw = document.createElement('a');
                    newgenre.setAttribute("href", curr_kw.url);
                    newgenre.appendChild(document.createTextNode(curr_kw.name + ', '));
                    element.appendChild(newkw);
                  }
                }
                else {
                  element.appendChild(document.createTextNode("n/a"));
                }
                
            });
        })
        .catch(function (err) {
            console.log(err.message);
            console.log(err.stack);
        });
}

function gather_games_text_info(textarray) {
    var sliced = textarray;
    return Promise.all(sliced.map(text =>
        new Promise((resolve, reject) => {
            var info = load_info_by_text(text);
            info
                .then(data =>
                    new Promise((resolve2, reject2) => {

                        var curr_info = data[0];
                        //console.log("curr_info",curr_info);
                        games_text_info[text] = curr_info;
                        if (curr_info.genres) {
                            for (let genre of curr_info.genres) {
                                //console.log("genre_num",genre);
                                genres_list[genre] = genre;

                            }
                        }
                        if (curr_info.keywords) {
                            for (let kw of curr_info.keywords) {
                                keyword_list[kw] = kw;
                            }
                        }
                        resolve2("resolve2");
                    })
                        .catch(function (err) {
                            console.log(err.message);
                            console.log(err.stack);
                        })
                )
                .then(function () {
                    console.log("resolve", text)
                    resolve("resolve");
                })
                .catch(function (err) {
                    console.log(err.message);
                    console.log(err.stack);
                });
        })
    ))
        .catch(function (err) {
            console.log(err.message);
            console.log(err.stack);
        });


}


function gather_games_info(textarray) {


    //var sliced = textarray.slice(0,2);
    var sliced = textarray;
    console.log("Try loading for:", sliced);
    return Promise.all(sliced.map(text =>
        new Promise((resolve, reject) => {
            var curr_id = get_game_id_by_text(text);
            curr_id
                .then(id =>
                    new Promise((resolve2, reject2) => {
                        id_list[text] = id;
                        var info = load_info_by_id(id);
                        info.then(
                            function (result) {
                                return result;
                            }
                        )
                            .then(data =>
                                new Promise((resolve3, reject3) => {
                                    var curr_info = data[0];
                                    games_info[id] = curr_info;

                                    //console.log("curr_info",curr_info);
                                    if (curr_info.genres) {
                                        for (let genre of curr_info.genres) {
                                            //console.log("genre_num",genre);
                                            genres_list[genre] = genre;

                                        }
                                        //console.log("genres",curr_info.genres);
                                    }
                                    if (curr_info.keywords) {
                                        for (let kw of curr_info.keywords) {
                                            keyword_list[kw] = kw;
                                        }
                                    }
                                    //console.log("resolve3");
                                    resolve3("resolve3");
                                })
                            )
                            .then(function () {
                                //console.log("resolve2");
                                resolve2("resolve2");
                            })
                            .catch(function (err) {
                                console.log(err.message);
                                console.log(err.stack);
                            });

                    })
                )
                .then(function () {
                    //console.log("info", games_info);
                    console.log("resolve", text);

                    resolve("resolve");
                    //return true;
                })
                .catch(function (err) {
                    console.log(err.message);
                    console.log(err.stack);
                });
        })
    ))
        .then(function (data2) {
            console.log("glist", genres_list);
        })
        .catch(function (err) {
            console.log(err.message);
            console.log(err.stack);
        });
}

async function load_info_by_text(text) {
    var text_url = (corsproxy + apiurl + req + text + "&" + fieldsall);
    return fetch(text_url,
        {
            headers: myheaders
        }
    )
        .then(res => res.json())
        .then(function (data) {
            //console.log("data",data);
            return data;
        })
        .catch(function (err) {
            console.log(err.message);
            console.log(err.stack);
        });
}

async function load_info_by_id(id) {
    var id_url = (corsproxy + apiurl + '/games/' + id + fields);
    return fetch(id_url, {headers: myheaders})
        .then(res => res.json())
        .then(function (data) {
            return data;
        })
        .catch(function (err) {
            console.log(err.message);
            console.log(err.stack);
        });
}

function get_game_id_by_text(text) {
    return fetch(corsproxy + apiurl + req + text, {headers: myheaders})
        .then(res => res.json())
        .then(function (data) {
            var game_id_num = data[0].id;
            var game_id = game_id_num.toString();
            return game_id;
        })
        .catch(function (err) {
            console.log(err.message);
            console.log(err.stack);
        });
}

function load_single_by_text(text, index) {
    var result = fetch(corsproxy + apiurl + req + text, {headers: myheaders})
        .then(res => res.json())
        .then(function (data) {
            var game_id_num = data[0].id;
            id_list.push(game_id_num);
            console.log("pushed", game_id_num);
            var game_id = game_id_num.toString();
            load_single_by_id(game_id, index, 1, 0, 0);
            return data;
        });
}

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements(
    selectorTxt,
    /* Required: The jQuery selector string that
                                specifies the desired element(s).
               */
    actionFunction,
    /* Required: The code to run when elements are
                                found. It is passed a jNode to the matched
                                element.
               */
    bWaitOnce,
    /* Optional: If false, will continue to scan for
                                new elements even after the first match is
                                found.
               */
    iframeSelector
    /* Optional: If set, identifies the iframe to
                                search.
               */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents()
            .find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
   */
        targetNodes.each(function () {
            var jThis = $(this);
            var alreadyFound = jThis.data('alreadyFound') || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction(jThis);
                if (cancelFound)
                    btargetsFound = false;
                else
                    jThis.data('alreadyFound', true);
            }
        });
    } else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval(timeControl);
        delete controlObj[controlKey];
    } else {
        //--- Set a timer, if needed.
        if (!timeControl) {
            timeControl = setInterval(function () {
                    waitForKeyElements(selectorTxt,
                        actionFunction,
                        bWaitOnce,
                        iframeSelector
                    );
                },
                300
            );
            controlObj[controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}